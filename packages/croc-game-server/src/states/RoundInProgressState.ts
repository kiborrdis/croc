import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { EndRoundState } from './EndRoundState';
import { delayCall, DelayedCall } from '../utils/DelayCall';

export class RoundInProgressState extends CrocGameState {
  private roundEndDelay?: DelayedCall;

  constructor() {
    super();

    this.subscribeToActions({
      enter: () => {
        this.roundEndDelay = delayCall(() => {
          this.context.setState(new EndRoundState());
        }, this.context.data.timePerRound);
      },

      ADD_DRAW_ACTIONS: (action, fromId) => {
        if (this.context.data.painter === fromId) {
          this.context.sendActionToAllButOne(fromId, action, fromId);

          this.context.data.drawActions.push(...action.payload);
        }
      },

      PROPOSE_ANSWER: (action, fromId) => {
        if (
          this.context.data.painter !== fromId &&
          this.context.data.nextWordPicker !== fromId
        ) {
          const rightAnswer = this.context.data.word === action.payload;

          this.context.sendActionToAll(
            Actions.addAnswers([
              {
                answer: action.payload,
                right: rightAnswer,
              },
            ]),
            fromId,
          );
          this.context.data.answers.push({
            answer: action.payload,
            right: rightAnswer,
            from: fromId,
          });

          if (this.context.data.word === action.payload) {
            this.context.setState(new EndRoundState(fromId));
          }
        }
      },

      playerDisconnected: () => {
        if (this.shouldEndRoundEarly()) {
          this.context.setState(new EndRoundState());
        }
      },

      exit: () => {
        if (this.roundEndDelay) {
          this.roundEndDelay.cancel();
          this.roundEndDelay = undefined;
        }
      },
    });
  }

  private shouldEndRoundEarly(): boolean {
    return (
      this.context.data.numberOfConnectedPlayers < 2 ||
      this.context.data.painter === null ||
      (this.context.data.numberOfConnectedPlayers < 3 &&
        this.context.data.nextWordPicker !== null)
    );
  }
}
