import { buildActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { GameContext } from './GameContext';
import { CrocGameData } from './CrocGameData';

export class CrocGameContext extends GameContext<CrocGameData> {
  public sendActionToAll(action: Actions, fromId: string = 'server') {
    this.responder.enqueueResponseForAll([buildActionMessage(action, fromId)]);
  }

  public sendActionTo(
    toId: string,
    action: Actions,
    fromId: string = 'server',
  ) {
    this.responder.enqueueResponseForOne(toId, [
      buildActionMessage(action, fromId),
    ]);
  }

  public sendActionToAllButOne(
    onesId: string,
    action: Actions,
    fromId: string = 'server',
  ) {
    this.responder.enqueueResponseForAllButOne(onesId, [
      buildActionMessage(action, fromId),
    ]);
  }
}
