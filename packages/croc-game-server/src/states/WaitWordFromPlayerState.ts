import { Actions } from 'croc-actions';
import { delayCall, DelayedCall } from '../utils/DelayCall';
import { CrocGameState } from './CrocGameState';
import { PickWordState } from './PickWordState';

export class WaitWordFromPlayerState extends CrocGameState {
  private delayed: DelayedCall | undefined;
  private sentVariants: string[] | undefined;

  constructor({ pickerPlayerId }: { pickerPlayerId: string }) {
    super();

    this.subscribeToActions({
      enter: () => {
        this.sentVariants = this.getVariants();
        this.context.sendActionTo(
          pickerPlayerId,
          Actions.demandWord(this.sentVariants),
        );

        const nextWordPickType = this.context.data.gameSettings
          ?.nextWordPickType;

        if (this.context.data.gameSettings) {
          this.delayed = delayCall(() => {
            this.context.setState(new PickWordState());

            if (this.context.data.gameSettings) {
              if (
                nextWordPickType === 'oldPainterFromVariants' ||
                nextWordPickType === 'oldPainterAnything'
              ) {
                this.context.data.nextWordPicker = null;
              } else if (nextWordPickType === 'newPainterFromVariants') {
                this.context.data.nextWordPicker = null;
              }
            }
          }, this.context.data.gameSettings.secondsToPickWord * 1000);
        }
      },

      PICK_WORD: ({ payload: word }, fromId) => {
        if (!word) {
          return;
        }

        if (
          fromId === pickerPlayerId &&
          (!this.sentVariants || this.sentVariants.includes(word))
        ) {
          this.context.data.word = word || null;
          this.context.setState(new PickWordState());
        }
      },

      playerDisconnected: ({ playerId }) => {
        if (playerId === pickerPlayerId) {
          this.context.setState(new PickWordState());
        }
      },

      exit: () => {
        if (this.delayed) {
          this.delayed.cancel();
        }
      },
    });
  }

  private getVariants = (): string[] | undefined => {
    if (!this.context.data.gameSettings) {
      return undefined;
    }

    if (
      this.context.data.gameSettings.nextWordPickType === 'oldPainterAnything'
    ) {
      return undefined;
    }

    return [
      ...new Array(this.context.data.gameSettings.numberOfWordVariants),
    ].map(() => {
      return this.context.getRandomWord();
    });
  };
}
