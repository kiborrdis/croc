import { PickWordState } from './PickWordState';
import { CrocGameData, CrocGameSettings } from '../CrocGameData';
import { Responder } from '../interfaces/Responder';
import { MockResponder } from '../testUtils/MockResponder';
import { actionMessageValidator } from '../testUtils/actionMessageValidator';
import { CrocGameContext } from '../CrocGameContext';
import { connectPlayerToStateContext } from '../testUtils/connectPlayerToContext';
import { buildActionMessage } from 'croc-messages';
import { Actions } from 'croc-actions';
import { CrocGameState } from './CrocGameState';
import { disconnectPlayerFromStateContext } from '../testUtils/disconnectPlayerFromStateContext';
import { WaitState } from './WaitState';
import { addPlayerToCrocData } from '../testUtils/addPlayerToCrocData';

const initialGameSettings: CrocGameSettings = {
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

describe('PickWordState', () => {
  let state: PickWordState;
  let responder: Responder;
  let context: SpyCrocGameContext;

  const initTestEnv = (
    players: string[],
    { nextWordPicker }: { nextWordPicker?: string } = {},
    gameSettings: CrocGameSettings = initialGameSettings,
  ): void => {
    const initialData: CrocGameData = new CrocGameData();
    initialData.gameSettings = gameSettings;
    initialData.nextWordPicker = nextWordPicker || null;

    players.forEach((id) => {
      addPlayerToCrocData(initialData, { id });
    });

    responder = new MockResponder();
    state = new PickWordState();
    context = new SpyCrocGameContext(state, initialData, responder);
  };

  describe('with 3 < connected players', () => {
    beforeEach(() => {
      initTestEnv(['1', '2', '3'], { nextWordPicker: '1' });
    });

    test('should return to WaitState if 1 player remaining', () => {
      disconnectPlayerFromStateContext(state, context, '1');
      disconnectPlayerFromStateContext(state, context, '2');

      expect(context.setState.mock.calls[1][0]).toBeInstanceOf(WaitState);
    });
  });
});
