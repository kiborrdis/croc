import { GameContext } from './GameContext';
import { GameState } from './states/GameState';
import { GameData } from './GameData';
import { Responder } from './interfaces/Responder';

class MockResponder implements Responder {
  public enqueueResponseForAll = jest.fn();
  public enqueueResponseForOne = jest.fn();
  public enqueueResponseForAllButOne = jest.fn();
}
class MockGameState extends GameState<GameData> {
  public enter = jest.fn();
  public handleMessage = jest.fn();
  public exit = jest.fn();
}

describe('GameContext', () => {
  let context: GameContext<GameData>;
  let initialState: MockGameState;

  beforeEach(() => {
    initialState = new MockGameState();
    context = new GameContext(initialState, new GameData, new MockResponder());
  });

  test('should enter initial state', () => {
    expect(initialState.enter).toBeCalledWith(context);
  });

  test('should enter new state', () => {
    const newState = new MockGameState();

    context.setState(newState);

    expect(newState.enter).toBeCalledWith(context);
  });

  test('should pass message handling to current state', () => {
    const newState = new MockGameState();

    context.setState(newState);
    context.handleMessage('me', { type: 'test' });

    expect(initialState.handleMessage).not.toBeCalled();
    expect(newState.handleMessage).toBeCalledWith('me', { type: 'test' });
  });

  test('should exit old state on changing', () => {
    const newState = new MockGameState();

    context.setState(newState);

    expect(initialState.exit).toBeCalled();
  })
});
