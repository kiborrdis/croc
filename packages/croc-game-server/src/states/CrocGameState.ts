import { Actions, ADD_CHAT_MESSAGES } from 'croc-actions';
import { Message, isActionMessage } from 'croc-messages';
import { CrocGameContext } from '../CrocGameContext';
import { CrocGameData } from '../CrocGameData';
import { GameState } from './GameState';
import {
  DISCONNECTED_MESSAGE,
  DisconnectedMessage,
} from '../messages/DisconnectPlayerMessage';
import {
  NEW_PLAYER_MESSAGE,
  NewPlayerMessage,
} from '../messages/NewPlayerMessage';

function isNewPlayerMessage(message: Message): message is NewPlayerMessage {
  return message.type === NEW_PLAYER_MESSAGE;
}

function isDisconnectMessage(message: Message): message is DisconnectedMessage {
  return message.type === DISCONNECTED_MESSAGE;
}

export abstract class CrocGameState extends GameState<
  CrocGameData,
  CrocGameContext
> {
  public handleMessage(fromId: string, message: Message): void {
    if (isActionMessage(message)) {
      this.beforeHandleAction(fromId, message.action);
      this.handleAction(fromId, message.action);
    } else if (isDisconnectMessage(message)) {
      this.beforeHandleDisconnectedPlayer(message.playerId);
      this.handleDisconnectedPlayer(message.playerId);
    } else if (isNewPlayerMessage(message)) {
      this.beforeHandleConnectedPlayer(message.player.id);
      this.handleNewPlayer(message.player.id);
    }
  }

  private beforeHandleAction(fromId: string, action: Actions) {
    switch (action.type) {
      case ADD_CHAT_MESSAGES:
        this.context.sendActionToAllButOne(fromId, action, fromId);

        this.context.data.chatMessages.push(
          ...action.payload.map((messsage) => ({
            text: messsage.text,
            from: fromId,
          })),
        );

        break;
    }
  }

  private beforeHandleDisconnectedPlayer(playerId: string) {
    if (playerId === this.context.data.painter) {
      this.context.data.painter = null;
    }
  }

  private beforeHandleConnectedPlayer(playerId: string) {
    this.sendCurrentGameStateToPlayer(playerId);
  }

  private sendCurrentGameStateToPlayer(playerId: string) {
    const data = this.context.data;

    if (data.painter) {
      this.context.sendActionTo(playerId, Actions.setPainter(data.painter));
    }

    if (data.roundStartedAt) {
      this.context.sendActionTo(
        playerId,
        Actions.startRound({
          remainingTime:
            data.timePerRound - (new Date().getTime() - data.roundStartedAt),
        }),
      );
    }

    if (data.chatMessages.length > 0) {
      this.context.sendActionTo(
        playerId,
        Actions.addChatMessages([...data.chatMessages]),
      );
    }

    if (data.drawActions.length > 0) {
      this.context.sendActionTo(
        playerId,
        Actions.addDrawActions([...data.drawActions]),
      );
    }

    if (data.answers.length > 0) {
      this.context.sendActionTo(
        playerId,
        Actions.addAnswers([...data.answers]),
      );
    }
  }

  protected handleAction(fromId: string, action: Actions): void {}
  protected handleNewPlayer(playerId: string): void {}
  protected handleDisconnectedPlayer(playerId: string): void {}

  protected unsetPicker(): void {
    const data = this.context.data;

    if (data.nextWordPicker) {
      this.context.sendActionToAll(Actions.setNextWordPicker());

      data.nextWordPicker = null;
    }
  }
}
