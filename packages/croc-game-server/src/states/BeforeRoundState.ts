import { Actions, PICK_WORD } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { RoundInProgressState } from './RoundInProgressState';
import { WaitState } from './WaitState';

export class BeforeRoundState extends CrocGameState {
  public handleEnter() {
    if (this.context.data.numberOfConnectedPlayers === 2 || !this.context.data.picker) {
      this.startTwoPlayerRound();
    }
  }

  public handleDisconnectedPlayer(playerId: string) {
    if (this.context.data.numberOfConnectedPlayers < 2) {
      this.context.setState(new WaitState());
    }

    if (this.context.data.numberOfConnectedPlayers === 2) {
      this.startTwoPlayerRound();
    }
  }

  public handleAction(fromId: string, action: Actions) {
    switch (action.type) {
      case PICK_WORD:
        if (this.context.data.picker === fromId) {
          if (action.payload) {
            this.context.data.word = action.payload;
          }

          this.startNewRound();
        }

        break;
    }
  }

  private startTwoPlayerRound() {
    this.unsetPicker();

    this.startNewRound();
  }

  private startNewRound() {
    const leader = this.context.data.leader || this.chooseLeader();
    const word = this.context.data.word || this.chooseWord();

    if (leader) {
      this.context.data.leader = leader;
      this.context.data.word = word;
      this.context.data.roundInProgress = true;
      this.context.data.answers = [];
      this.context.data.drawActions = [];

      this.context.sendActionToAll(Actions.setLeader(leader));
      this.context.sendActionToAllButOne(leader, Actions.startRound());
      this.context.sendActionTo(leader, Actions.startRound(word));

      this.context.setState(new RoundInProgressState());
    }
  }

  private chooseLeader() {
    const players = this.context.data.players;
    const variants = Object.keys(players).filter((id) => !players[id].disconnected);

    return this.context.data.pickLeaderStrategy(variants) || null;
  }

  private chooseWord() {
    return this.context.data.pickWord();
  }
}
