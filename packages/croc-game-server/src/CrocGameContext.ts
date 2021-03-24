import { buildActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { GameContext } from './GameContext';
import { CrocGameData } from './CrocGameData';
import { CrocGameStateActions } from './states/CrocGameState';

export class CrocGameContext extends GameContext<
  CrocGameStateActions,
  CrocGameData
> {
  public handleMessage(
    fromId: string,
    message: CrocGameStateActions[keyof CrocGameStateActions],
  ): void {
    if (!message) {
      return;
    }

    if (message.type === 'newPlayer') {
      this.state.triggerAction('playerConnected', message, fromId);
    } else if (message.type === 'disconnected') {
      this.state.triggerAction('playerDisconnected', message, fromId);
    } else if (message.type === 'deletePlayer') {
      this.state.triggerAction('playerDeleted', message, fromId);
    } else {
      this.state.triggerAction(message.type, message, fromId);
    }
  }

  public sendActionToAll(action: Actions, fromId = 'server'): void {
    this.responder.enqueueResponseForAll([buildActionMessage(action, fromId)]);
  }

  public sendActionTo(toId: string, action: Actions, fromId = 'server'): void {
    this.responder.enqueueResponseForOne(toId, [
      buildActionMessage(action, fromId),
    ]);
  }

  public sendActionToAllButOne(
    onesId: string,
    action: Actions,
    fromId = 'server',
  ): void {
    this.responder.enqueueResponseForAllButOne(onesId, [
      buildActionMessage(action, fromId),
    ]);
  }
}
