import { Actions, ADD_DRAW_ACTIONS, PROPOSE_ANSWER } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { EndRoundState } from './EndRoundState';
import { delayCall, DelayedCall } from '../utils/DelayCall';

export class RoundInProgressState extends CrocGameState {
  private roundEndDelay?: DelayedCall;

  public handleEnter(): void {
    this.roundEndDelay = delayCall(() => {
      this.context.setState(new EndRoundState());
    }, this.context.data.timePerRound);
  }

  public handleAction(fromId: string, action: Actions): void {
    switch (action.type) {
      case ADD_DRAW_ACTIONS:
        if (this.context.data.painter === fromId) {
          this.context.sendActionToAllButOne(fromId, action, fromId);

          this.context.data.drawActions.push(...action.payload);
        }

        break;
      case PROPOSE_ANSWER:
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
        break;
    }
  }

  public handleDisconnectedPlayer(playerId: string): void {
    if (this.shouldEndRoundEarly()) {
      this.context.setState(new EndRoundState());
    }
  }

  private shouldEndRoundEarly(): boolean {
    return (
      this.context.data.numberOfConnectedPlayers < 2 ||
      this.context.data.painter === null ||
      (this.context.data.numberOfConnectedPlayers < 3 &&
        this.context.data.nextWordPicker !== null)
    );
  }

  public handleExit(): void {
    if (this.roundEndDelay) {
      this.roundEndDelay.cancel();
      this.roundEndDelay = undefined;
    }
  }
}
