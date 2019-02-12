import { Message } from 'croc-messages';
import { GameContext } from '../GameContext';
import { GameData } from '../GameData';

export class GameState<D extends GameData, C extends GameContext<D> = GameContext<D>> {
  protected context!: C;

  public enter(context: C) {
    this.context = context;
    this.handleEnter();
  }

  public exit() {
    this.handleExit();
  }

  public handleEnter() {}
  public handleExit() {}
  public handleMessage(fromId: string, message: Message) {}
}
