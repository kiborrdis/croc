import { Message } from 'croc-messages';
import { GameContext } from '../GameContext';
import { GameData } from '../GameData';

export class GameState<
  D extends GameData,
  C extends GameContext<D> = GameContext<D>
> {
  protected context!: C;

  public enter(context: C): void {
    this.context = context;
    this.handleEnter();
  }

  public exit(): void {
    this.handleExit();
  }

  public handleEnter(): void {}
  public handleExit(): void {}
  public handleMessage(fromId: string, message: Message): void {}
}
