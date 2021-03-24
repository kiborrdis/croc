import { Actions, ActionTypeToAction } from 'croc-actions';
import { CrocGameContext } from '../CrocGameContext';
import { CrocGameData } from '../CrocGameData';
import { GameState, GameStateActions } from './GameState';
import { DisconnectedMessage } from '../messages/DisconnectPlayerMessage';
import { NewPlayerMessage } from '../messages/NewPlayerMessage';
import { DeletePlayerMessage } from '../messages/DeletePlayerMessage';

export type CrocGameStateActions = {
  playerConnected: NewPlayerMessage;
  playerDisconnected: DisconnectedMessage;
  playerDeleted: DeletePlayerMessage;
} & GameStateActions &
  ActionTypeToAction;

export abstract class CrocGameState extends GameState<
  CrocGameStateActions,
  CrocGameData,
  CrocGameContext
> {
  constructor() {
    super();

    this.subscribeToActions({
      playerConnected: ({ player }) => {
        this.sendCurrentGameStateToPlayer(player.id);
      },
      playerDisconnected: ({ playerId }) => {
        if (playerId === this.context.data.painter) {
          this.context.data.painter = null;
        }
      },
      ADD_CHAT_MESSAGES: (action, fromId) => {
        this.context.sendActionToAllButOne(fromId, action, fromId);

        this.context.data.chatMessages.push(
          ...action.payload.map((messsage) => ({
            text: messsage.text,
            from: fromId,
          })),
        );
      },
    });
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

  protected unsetPicker(): void {
    const data = this.context.data;

    if (data.nextWordPicker) {
      this.context.sendActionToAll(Actions.setNextWordPicker());

      data.nextWordPicker = null;
    }
  }
}
