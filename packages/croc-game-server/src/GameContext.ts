import { GameState } from './states/GameState';
import { Message } from 'croc-messages';
import { GameData } from './GameData';
import { Responder } from './interfaces/Responder';

export class GameContext<D extends GameData> {
  private state!: GameState<D>;
  private gameData: D;
  protected responder: Responder;

  constructor(initialState: GameState<D>, data: D, responder: Responder) {
    this.gameData = data;
    this.responder = responder;

    this.setState(initialState);
  }

  public get data(): D {
    return this.gameData;
  }

  public handleMessage(fromId: string, message: Message): void {
    this.state.handleMessage(fromId, message);
  }

  public setState(state: GameState<D>): void {
    if (this.state) {
      this.state.exit();
    }

    this.state = state;

    state.enter(this);
  }
}
