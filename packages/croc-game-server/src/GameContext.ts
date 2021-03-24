import { GameState, GameStateActions } from './states/GameState';
import { GameData } from './GameData';
import { Responder } from './interfaces/Responder';

export abstract class GameContext<
  A extends GameStateActions,
  D extends GameData
> {
  protected state!: GameState<A, D>;
  private gameData: D;
  protected responder: Responder;

  constructor(initialState: GameState<A, D>, data: D, responder: Responder) {
    this.gameData = data;
    this.responder = responder;

    this.setState(initialState);
  }

  public get data(): D {
    return this.gameData;
  }

  public abstract handleMessage(fromId: string, message: A[keyof A]): void;

  public setState(state: GameState<A, D>): void {
    if (this.state) {
      this.state.exit();
    }

    this.state = state;

    state.enter(this);
  }
}
