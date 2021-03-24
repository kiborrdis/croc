import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { PickWordState } from './PickWordState';

export class WaitState extends CrocGameState {
  constructor() {
    super();

    this.subscribeToActions({
      enter: () => {
        this.context.sendActionToAll(
          Actions.wait(
            this.context.data.gameSettings ? undefined : { type: 'settings' },
          ),
        );
      },

      playerConnected: ({ player: { id } }) => {
        if (this.context.data.numberOfConnectedPlayers === 1) {
          this.context.data.painter = id;
          this.context.sendActionToAll(Actions.setPainter(id));

          return;
        }

        if (!this.context.data.gameSettings) {
          return;
        }

        this.context.setState(new PickWordState());
      },

      SET_SETTINGS: (action) => {
        this.context.data.gameSettings = {
          ...action.payload,
          secondsToPickWord: 60,
          wordBase:
            typeof action.payload.wordBase === 'string'
              ? parseCustomWordBase(action.payload.wordBase)
              : [action.payload.wordBase.baseId],
        };

        if (this.context.data.numberOfConnectedPlayers > 1) {
          this.context.setState(new PickWordState());
        }
      },
    });
  }
}

const parseCustomWordBase = (wordBase: string): string[] => {
  return wordBase.split(/\n/);
};
