import { buildActionMessage, isActionMessage, Message } from 'croc-messages';
import {
  Actions,
  ADD_CHAT_MESSAGES,
  ADD_DRAW_ACTIONS,
  PROPOSE_ANSWER,
  PICK_WORD,
} from 'croc-actions';
import { Responder } from './interfaces/Responder';
import { Game } from './Game';
import { CrocGameData } from './CrocGameData';

interface CrocGameConfig {
  reconnectionTimeout: number;
  timeForRound: number;
  pickWord: () => string;
}

const RIGHT_GUESS_SCORE_DELTA = 10;

export class CrocGame extends Game<CrocGameData> {
  private pickWord: () => string;
  private chatMessages: Array<{ text: string, from: string }> = [];
  private answers: Array<{ answer: string, right: boolean, from: string }> = [];
  private drawActions: any[] = [];
  private timePerRound: number;
  private roundTimeout?: NodeJS.Timeout;

  constructor(params: { responder: Responder, config: CrocGameConfig, gameDataInitializer: () => CrocGameData }) {
    super({ responder: params.responder, config: {
      reconnectionTimeout: params.config.reconnectionTimeout,
      deletePlayerMessageCreator: (id: string) => buildActionMessage(
        Actions.deletePlayer(id),
        'server',
      ),
      addPlayersMessageCreator: (players) => buildActionMessage(
        Actions.addPlayers(players),
        'server',
      ),
    }, gameDataInitializer: params.gameDataInitializer });

    this.pickWord = params.config.pickWord;
    this.timePerRound = params.config.timeForRound;
  }

  public handleMessage(fromId: string, message: Message) {
    if (isActionMessage(message)) {
      this.handleAction(fromId, message.action);
    }
  }

  private handleAction(fromId: string, action: Actions) {
    switch (action.type) {
      case ADD_CHAT_MESSAGES:
        this.sendActionToAllButOne(fromId, action, fromId);

        this.chatMessages.push(
          ...(action.payload.map((messsage) => ({ text: messsage.text, from: fromId }))),
        );

        break;
      case ADD_DRAW_ACTIONS:
        if (this.data.leader === fromId) {
          this.sendActionToAllButOne(fromId, action, fromId);

          this.drawActions.push(...action.payload);
        }

        break;
      case PROPOSE_ANSWER:
        if (this.data.leader !== fromId && this.data.picker !== fromId) {
          const rightAnswer = this.data.word === action.payload;

          this.sendActionToAll(Actions.addAnswers([{
            answer: action.payload,
            right: rightAnswer,
          }]), fromId);
          this.answers.push({ answer: action.payload, right: rightAnswer, from: fromId });

          if (this.data.word === action.payload) {
            this.finalizeRound(fromId);
          }
        }
        break;
      case PICK_WORD:
        if (!this.data.roundInProgress && this.data.picker === fromId) {
          this.data.word = action.payload;

          this.startNewRound();
        }

        break;
    }
  }

  private finalizeRound(winnerId: string) {
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
    }

    const prevLeader = this.data.leader;

    this.data.roundInProgress = false;

    if (this.data.picker) {
      this.sendActionTo(this.data.picker, Actions.setPicker());

      this.data.picker = null;
    }

    this.data.leader = winnerId;
    this.data.word = null;
    this.data.players[winnerId].score += RIGHT_GUESS_SCORE_DELTA;

    this.sendActionToAll(Actions.endRound());
    this.sendActionToAll(Actions.setLeader(winnerId));
    this.sendActionToAll(Actions.changePlayerScore({ id: winnerId, newScore: this.data.players[winnerId].score}));

    if (!prevLeader || Object.keys(this.data.players).length === 2) {
      this.startNewRound();
    } else {
      this.data.picker = prevLeader;

      this.sendActionTo(this.data.picker, Actions.setPicker(prevLeader));
    }
  }

  private finalizeRoundWithoutWinner() {
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
    }

    this.data.leader = Object.keys(this.data.players).find((id) => !this.data.players[id].disconnected) || null;

    if (this.data.leader) {
      this.sendActionToAll(Actions.setLeader(this.data.leader));
    }

    if (this.data.picker) {
      this.sendActionTo(this.data.picker, Actions.setPicker());

      this.data.picker = null;
    }
    this.data.word = null;

    this.sendActionToAll(Actions.endRound());
  }

  protected handleNewPlayer(playerId: string) {
    if (Object.keys(this.data.players).length === 1) {
      this.data.leader = playerId;

      this.sendActionToAll(Actions.setLeader(playerId));
      return;
    }

    this.sendCurrentGameStateToPlayer(playerId);

    if (Object.keys(this.data.players).length === 2 && this.data.leader) {
      this.startNewRound();
    }
  }

  private startNewRound() {
    if (!this.data.word) {
      this.data.word = this.pickWord();
    }

    if (this.data.leader) {
      this.data.roundInProgress = true;

      this.sendActionToAllButOne(this.data.leader, Actions.startRound());
      this.sendActionTo(this.data.leader, Actions.startRound(this.data.word));

      this.roundTimeout = setTimeout(() => {
        this.finalizeRoundWithoutWinner();
      }, this.timePerRound);
    }
  }

  private sendCurrentGameStateToPlayer(playerId: string) {
    if (this.data.leader) {
      this.sendActionTo(playerId, Actions.setLeader(this.data.leader));
    }

    if (this.chatMessages.length > 0) {
      this.sendActionTo(playerId, Actions.addChatMessages([ ...this.chatMessages ]));
    }

    if (this.drawActions.length > 0) {
      this.sendActionTo(playerId, Actions.addDrawActions([...this.drawActions]));
    }

    if (this.answers.length > 0) {
      this.sendActionTo(playerId, Actions.addAnswers([...this.answers]));
    }
  }

  protected handleDisconnectedPlayer(playerId: string) {
    if (this.numberOfConnectedPlayers < 2) {
      this.data.leader = null;
      this.data.picker = null;
      this.data.word = null;

      this.finalizeRoundWithoutWinner();
      this.sendActionToAll(Actions.wait());
      return;
    }

    if (this.data.picker === playerId && !this.data.roundInProgress) {
      this.startNewRound();
    } else if (this.data.leader === playerId) {
      this.data.leader = null;

      if (this.data.picker) {
        this.sendActionTo(this.data.picker, Actions.setPicker());
        this.data.picker = null;
      }

      this.finalizeRoundWithoutWinner();
      this.startNewRound();
    }
  }

  private sendActionToAll(action: Actions, fromId: string = 'server') {
    this.responder.enqueueResponseForAll(
      [buildActionMessage(action, fromId)],
    );
  }

  private sendActionTo(toId: string, action: Actions, fromId: string = 'server') {
    this.responder.enqueueResponseForOne(
      toId,
      [buildActionMessage(action, fromId)],
    );
  }

  private sendActionToAllButOne(onesId: string, action: Actions, fromId: string = 'server') {
    this.responder.enqueueResponseForAllButOne(
      onesId,
      [buildActionMessage(action, fromId)],
    );
  }
}
