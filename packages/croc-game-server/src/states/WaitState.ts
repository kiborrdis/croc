import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { BeforeRoundState } from './BeforeRoundState';

export class WaitState extends CrocGameState {
  public handleEnter(): void {
    this.context.sendActionToAll(Actions.wait());
  }

  public handleNewPlayer(fromId: string): void {
    if (this.context.data.numberOfConnectedPlayers === 1) {
      this.context.data.leader = fromId;
      this.context.sendActionToAll(Actions.setLeader(fromId));

      return;
    }

    this.context.setState(new BeforeRoundState());
  }
}
