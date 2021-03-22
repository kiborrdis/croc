import { Actions, SET_SETTINGS } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { BeforeRoundState } from './BeforeRoundState';

export class WaitState extends CrocGameState {
  public handleEnter(): void {
    this.context.sendActionToAll(
      Actions.wait(
        this.context.data.gameSettings ? undefined : { type: 'settings' },
      ),
    );
  }

  public handleNewPlayer(fromId: string): void {
    if (this.context.data.numberOfConnectedPlayers === 1) {
      this.context.data.painter = fromId;
      this.context.sendActionToAll(Actions.setPainter(fromId));

      return;
    }

    if (!this.context.data.gameSettings) {
      return;
    }

    this.context.setState(new BeforeRoundState());
  }

  public handleAction(fromId: string, action: Actions): void {
    if (action.type === SET_SETTINGS) {
      this.context.data.gameSettings = {
        ...action.payload,
        wordBase:
          typeof action.payload.wordBase === 'string'
            ? parseCustomWordBase(action.payload.wordBase)
            : action.payload.wordBase.baseId,
      };

      if (this.context.data.painter) {
        this.context.setState(new BeforeRoundState());
      }
    }
  }
}

const parseCustomWordBase = (wordBase: string): string[] => {
  return wordBase.split(/\n/);
};
