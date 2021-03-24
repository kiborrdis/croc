import { WaitState } from './WaitState';
import { CrocGameData, CrocGameSettings } from '../CrocGameData';
import { Responder } from '../interfaces/Responder';
import { MockResponder } from '../testUtils/MockResponder';
import { actionMessageValidator } from '../testUtils/actionMessageValidator';
import { CrocGameContext } from '../CrocGameContext';
import { connectPlayerToStateContext } from '../testUtils/connectPlayerToContext';
import { buildActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { PickWordState } from './PickWordState';

const gameSettings: CrocGameSettings = {
  nextPainterPickType: 'random',
  nextWordPickType: 'oldPainterAnything',
  numberOfWordVariants: 3,
  wordBase: ['zzzz'],
  secondsToPickWord: 60,
};

class SpyCrocGameContext extends CrocGameContext {
  setState = jest.fn((state: CrocGameState) => {
    super.setState(state);
  });
}

describe('WaitState', () => {
  let state: WaitState;
  let responder: Responder;
  let context: SpyCrocGameContext;

  const applySettings = () => {
    state.triggerAction(
      'SET_SETTINGS',
      Actions.setSettings({ ...gameSettings, wordBase: 'zzz' }),
      'foo',
    );
  };

  beforeEach(() => {
    const initialData: CrocGameData = new CrocGameData();
    state = new WaitState();
    responder = new MockResponder();

    context = new SpyCrocGameContext(state, initialData, responder);
    context.setState = jest.fn((state) => {});
  });

  test('should send wait for settings at start', () => {
    // responder.enqueueResponseForAll.
    expect(responder.enqueueResponseForAll).toBeCalledWith(
      actionMessageValidator('WAIT', { type: 'settings' }),
    );
  });

  test('should apply settings on settings action', () => {
    applySettings();

    expect(context.data.gameSettings).toEqual({
      ...gameSettings,
      wordBase: ['zzz'],
    });
  });

  test('should set first connected player as painter', () => {
    connectPlayerToStateContext(state, context, {
      id: '1',
    });

    expect(responder.enqueueResponseForAll).toBeCalledWith(
      actionMessageValidator('SET_PAINTER', '1'),
    );
  });

  test('should not move to new state if settings set when there is one player', () => {
    connectPlayerToStateContext(state, context, {
      id: '1',
    });
    applySettings();

    expect(context.setState).not.toBeCalled();
  });

  test('should not move to new state after second player connected without settings', () => {
    connectPlayerToStateContext(state, context, {
      id: '1',
    });
    connectPlayerToStateContext(state, context, {
      id: '2',
    });

    const spy = jest.spyOn(context, 'setState');

    expect(spy).not.toBeCalled();
  });

  test('should move to BeforeRoundState if 2 players and settings set', () => {
    connectPlayerToStateContext(state, context, {
      id: '1',
    });
    connectPlayerToStateContext(state, context, {
      id: '2',
    });

    applySettings();

    expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
  });

  test('should move to BeforeRoundState if settings set and second player connected', () => {
    connectPlayerToStateContext(state, context, {
      id: '1',
    });
    applySettings();
    connectPlayerToStateContext(state, context, {
      id: '2',
    });

    expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
  });

  test('should send simple wait if settings already set', () => {
    const initialData: CrocGameData = new CrocGameData();

    initialData.gameSettings = {
      nextPainterPickType: 'random',
      nextWordPickType: 'oldPainterAnything',
      numberOfWordVariants: 3,
      wordBase: ['zzzz'],
      secondsToPickWord: 60,
    };

    state = new WaitState();
    responder = new MockResponder();
    context = new SpyCrocGameContext(state, initialData, responder);

    expect(responder.enqueueResponseForAll).toBeCalledWith(
      actionMessageValidator('WAIT', undefined),
    );
  });
});
