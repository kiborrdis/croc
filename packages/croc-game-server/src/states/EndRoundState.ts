import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { PickWordState } from './PickWordState';
import { WaitState } from './WaitState';

const RIGHT_GUESS_SCORE_DELTA = 10;

export class EndRoundState extends CrocGameState {
  private winnerId: string | null;

  constructor(winnerId?: string) {
    super();

    this.winnerId = winnerId || null;

    this.subscribeToActions({
      enter: () => {
        this.finalizeRound();
      },
    });
  }

  private finalizeRound() {
    const data = this.context.data;
    const prevLeader = data.painter;

    this.unsetPicker();
    data.word = null;
    data.roundStartedAt = 0;

    if (this.winnerId) {
      this.processWinner(this.winnerId);
    }

    data.painter = this.winnerId;

    this.context.sendActionToAll(Actions.endRound());

    if (prevLeader) {
      data.nextWordPicker = prevLeader;

      this.context.sendActionToAll(Actions.setNextWordPicker(prevLeader));
    }

    if (data.numberOfConnectedPlayers < 2) {
      this.context.setState(new WaitState());
    } else {
      this.context.setState(new PickWordState());
    }
  }

  private processWinner(winnerId: string) {
    const data = this.context.data;

    data.players[winnerId].score =
      (data.players[winnerId].score || 0) + RIGHT_GUESS_SCORE_DELTA;

    this.context.sendActionToAll(
      Actions.changePlayerScore({
        id: winnerId,
        newScore: data.players[winnerId].score || 0,
      }),
    );
  }
}
