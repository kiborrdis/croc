import { Actions, ADD_DRAW_ACTIONS, PROPOSE_ANSWER } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { EndRoundState } from './EndRoundState';

const RIGHT_GUESS_SCORE_DELTA = 10;

export class RoundInProgressState extends CrocGameState {
  private roundTimeout?: NodeJS.Timeout;

  public handleEnter() {
    this.roundTimeout = setTimeout(() => {
      this.context.setState(new EndRoundState());
    }, this.context.data.timePerRound);
  }

  public handleAction(fromId: string, action: Actions) {
    switch (action.type) {
      case ADD_DRAW_ACTIONS:
        if (this.context.data.leader === fromId) {
          this.context.sendActionToAllButOne(fromId, action, fromId);

          this.context.data.drawActions.push(...action.payload);
        }

        break;
      case PROPOSE_ANSWER:
        if (this.context.data.leader !== fromId && this.context.data.picker !== fromId) {
          const rightAnswer = this.context.data.word === action.payload;

          this.context.sendActionToAll(Actions.addAnswers([{
            answer: action.payload,
            right: rightAnswer,
          }]), fromId);
          this.context.data.answers.push(
            { answer: action.payload, right: rightAnswer, from: fromId },
          );

          if (this.context.data.word === action.payload) {
            this.context.setState(new EndRoundState(fromId));
          }
        }
        break;
    }
  }

  public handleDisconnectedPlayer(playerId: string) {
    if (this.shouldEndRoundEarly()) {
      this.context.setState(new EndRoundState());
    }
  }

  private shouldEndRoundEarly(): boolean {
    return (
      this.context.data.numberOfConnectedPlayers < 2
      || this.context.data.leader === null
      || (this.context.data.numberOfConnectedPlayers < 3 && this.context.data.picker !== null)
    );
  }

  public handleEnd() {
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
    }
  }
}
