import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { RoundInProgressState } from './RoundInProgressState';
import { WaitState } from './WaitState';

export class PickWordState extends CrocGameState {
  constructor() {
    super();

    this.subscribeToActions({
      enter: () => {
        if (
          this.context.data.numberOfConnectedPlayers === 2 ||
          !this.context.data.nextWordPicker
        ) {
          this.startTwoPlayerRound();
        }
      },
      playerDisconnected: () => {
        if (this.context.data.numberOfConnectedPlayers < 2) {
          this.context.setState(new WaitState());
        }

        if (this.context.data.numberOfConnectedPlayers === 2) {
          this.startTwoPlayerRound();
        }
      },

      PICK_WORD: (action, fromId) => {
        if (this.context.data.nextWordPicker === fromId) {
          if (action.payload) {
            this.context.data.word = action.payload;
          } else {
            this.unsetPicker();
          }

          this.startNewRound();
        }
      },
    });
  }

  private startTwoPlayerRound() {
    this.unsetPicker();

    this.startNewRound();
  }

  private startNewRound() {
    const leader = this.context.data.painter || this.chooseLeader();
    const word = this.context.data.word || this.chooseWord();

    if (leader) {
      this.context.data.painter = leader;
      this.context.data.word = word;
      this.context.data.roundStartedAt = new Date().getTime();
      this.context.data.answers = [];
      this.context.data.drawActions = [];

      this.context.sendActionToAll(Actions.setPainter(leader));
      this.context.sendActionToAllButOne(
        leader,
        Actions.startRound({
          remainingTime: this.context.data.timePerRound,
        }),
      );
      this.context.sendActionTo(
        leader,
        Actions.startRound({
          word,
          remainingTime: this.context.data.timePerRound,
        }),
      );

      this.context.setState(new RoundInProgressState());
    }
  }

  private chooseLeader() {
    const players = this.context.data.players;
    const variants = Object.keys(players)
      .filter((id) => !players[id].disconnected)
      .filter((id) => id !== this.context.data.nextWordPicker);

    return this.context.data.pickLeaderStrategy(variants) || null;
  }

  private chooseWord() {
    return this.context.data.pickWord();
  }
}
