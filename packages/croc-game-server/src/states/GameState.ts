import { GameContext } from '../GameContext';
import { GameData } from '../GameData';

export type GameStateActions = {
  enter: void;
  exit: void;
};

type ActionHandler<K extends string | number | symbol, A extends any> = (
  action: A,
  fromId: string,
  type: K,
) => void;

type ActionsToActionHandlers<A extends Record<string, any>> = {
  [K in keyof A]?: ActionHandler<K, A[K]>[];
};

type ActionsToNewActionHandlers<A extends Record<string, any>> = {
  [K in keyof A]?: ActionHandler<K, A[K]>;
};

export class GameState<
  A extends GameStateActions,
  D extends GameData,
  C extends GameContext<A, D> = GameContext<A, D>
> {
  protected context!: C;
  private actionHandlers: ActionsToActionHandlers<A> = {};

  public enter(context: C): void {
    this.context = context;

    this.triggerAction('enter', undefined, 'self');
  }

  public exit(): void {
    this.triggerAction('exit', undefined, 'self');
  }

  public triggerAction<K extends keyof A = keyof A>(
    type: K,
    action: A[K],
    fromId: string,
  ): void {
    const handlers = this.actionHandlers[type];

    if (handlers) {
      handlers.forEach((handler) => handler(action, fromId, type));
    }
  }

  protected subscribeToActions(
    newHandlers: ActionsToNewActionHandlers<A>,
  ): void {
    Object.keys(newHandlers).forEach((rawKey) => {
      const key: keyof typeof newHandlers = rawKey as keyof typeof newHandlers;
      const currentHandlersForKey = this.actionHandlers[key] ?? [];
      const newHandler = newHandlers[key] ?? undefined;

      if (newHandler !== undefined) {
        this.actionHandlers[key] = [...currentHandlersForKey, newHandler];
      }
    });
  }
}
