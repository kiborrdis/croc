import { GameContext } from './GameContext';
import { GameState, GameStateActions } from './states/GameState';
import { GameData } from './GameData';
import { Responder } from './interfaces/Responder';

class TestGameContext extends GameContext<GameStateActions, GameData> {
  public handleMessage(fromId: string, message: undefined): void {}
}

class MockResponder implements Responder {
  public enqueueResponseForAll = jest.fn();
  public enqueueResponseForOne = jest.fn();
  public enqueueResponseForAllButOne = jest.fn();
}
class MockGameState extends GameState<GameStateActions, GameData> {
  public enter = jest.fn();
  public triggerAction = jest.fn();
  public exit = jest.fn();
}

describe('GameContext', () => {
  let context: GameContext<GameStateActions, GameData>;
  let initialState: MockGameState;

  beforeEach(() => {
    initialState = new MockGameState();
    context = new TestGameContext(
      initialState,
      new GameData(),
      new MockResponder(),
    );
  });

  test('should enter initial state', () => {
    expect(initialState.enter).toBeCalledWith(context);
  });

  test('should enter new state', () => {
    const newState = new MockGameState();

    context.setState(newState);

    expect(newState.enter).toBeCalledWith(context);
  });

  test('should exit old state on changing', () => {
    const newState = new MockGameState();

    context.setState(newState);

    expect(initialState.exit).toBeCalled();
  });
});
