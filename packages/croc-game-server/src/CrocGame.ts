import { buildActionMessage, isActionMessage, Message, ActionMessage} from 'croc-messages';
import {
  Actions,
  ADD_CHAT_MESSAGES,
  ADD_DRAW_ACTIONS,
  PROPOSE_ANSWER,
  PICK_WORD,
} from 'croc-actions';
import { Responder } from './interfaces/Responder';
import { Game } from './Game';

interface CrocGameConfig {
  reconnectionTimeout: number;
  pickWord: () => string;
}

interface GameState {
  leader: string | null;
  picker: string | null;
  word: string | null;
  roundInProgress: boolean;
}

const RIGHT_GUESS_SCORE_DELTA = 10;

export class CrocGame extends Game {
  private state: GameState = {
    leader: null,
    picker: null,
    word: null,
    roundInProgress: false,
  };
  private pickWord: () => string;
  private chatMessages: Array<{ text: string, from: string }> = [];
  private answers: Array<{ answer: string, right: boolean, from: string }> = [];
  private drawActions: any[] = [];

  constructor(responder: Responder, config: CrocGameConfig) {
    super(responder, {
      reconnectionTimeout: config.reconnectionTimeout,
      deletePlayerMessageCreator: (id: string) => buildActionMessage(
        Actions.deletePlayer(id),
        'server',
      ),
      addPlayersMessageCreator: (players) => buildActionMessage(
        Actions.addPlayers(players),
        'server',
      ),
    });

    this.pickWord = config.pickWord;
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
        if (this.state.leader === fromId) {
          this.sendActionToAllButOne(fromId, action, fromId);

          this.drawActions.push(...action.payload);
        }

        break;
      case PROPOSE_ANSWER:
        if (this.state.leader !== fromId) {
          const rightAnswer = this.state.word === action.payload;

          this.sendActionToAll(Actions.addAnswers([{
            answer: action.payload,
            right: rightAnswer,
          }]), fromId);
          this.answers.push({ answer: action.payload, right: rightAnswer, from: fromId });

          if (this.state.word === action.payload) {
            this.finalizeRound(fromId);
          }
        }
        break;
      case PICK_WORD:
        if (!this.state.roundInProgress && this.state.picker === fromId) {
          this.state.word = action.payload;

          this.startNewRound();
        }

        break;
    }
  }

  private finalizeRound(winnerId: string) {
    const prevLeader = this.state.leader;

    this.state.roundInProgress = false;

    this.sendActionToAll(Actions.endRound());

    this.state.leader = winnerId;
    this.state.word = null;
    this.players[winnerId].score += RIGHT_GUESS_SCORE_DELTA;

    this.sendActionToAll(Actions.setLeader(winnerId));
    this.sendActionToAll(Actions.changePlayerScore({ id: winnerId, newScore: this.players[winnerId].score}));
    if (!prevLeader || Object.keys(this.players).length === 2) {
      this.startNewRound();
    } else {
      this.state.picker = prevLeader;

      this.sendActionTo(this.state.picker, Actions.setPicker(prevLeader));
    }
  }

  protected handleNewPlayer(playerId: string) {
    if (Object.keys(this.players).length === 1) {
      this.state.leader = playerId;

      this.sendActionToAll(Actions.setLeader(playerId));
      return;
    }

    this.sendCurrentGameStateToPlayer(playerId);

    if (Object.keys(this.players).length === 2 && this.state.leader) {
      this.startNewRound();
    }
  }

  private startNewRound() {
    if (!this.state.word) {
      this.state.word = this.pickWord();
    }

    if (this.state.leader) {
      this.state.roundInProgress = true;

      this.sendActionToAllButOne(this.state.leader, Actions.startRound());
      this.sendActionTo(this.state.leader, Actions.startRound(this.state.word));

      if (this.state.picker) {
        this.sendActionTo(this.state.picker, Actions.setPicker());
      }
    }
  }

  private sendCurrentGameStateToPlayer(playerId: string) {
    if (this.state.leader) {
      this.sendActionTo(playerId, Actions.setLeader(this.state.leader));
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
