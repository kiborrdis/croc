import { WaitWordFromPlayerState } from './WaitWordFromPlayerState';
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
import { PickWordState } from './PickWordState';
import { config } from 'yargs';

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const initialGameSettings: CrocGameSettings = {
  nextPainterPickType: 'random',
  nextWordPickType: 'newPainterFromVariants',
  numberOfWordVariants: 2,
  wordBase: ['a', 'b', 'c', 'd'],
  secondsToPickWord: 2,
};

class SpyCrocGameContext extends CrocGameContext {
  private _wordIndex = 0;
  get wordIndex(): number {
    if (this._wordIndex === undefined) {
      this._wordIndex = 0;
    }

    return this._wordIndex;
  }

  setState = jest.fn((state: CrocGameState) => {
    super.setState(state);
  });

  getRandomWord() {
    if (!this.data.gameSettings?.wordBase) {
      return '';
    }

    const word = this.data.gameSettings.wordBase[
      this.wordIndex % this.data.gameSettings.wordBase.length
    ];
    this._wordIndex++;

    return word;
  }
}

describe('WaitWordFromPlayerState', () => {
  let state: WaitWordFromPlayerState;
  let responder: Responder;
  let context: SpyCrocGameContext;

  const initTestEnv = (
    pickerPlayerId: string,
    players: string[],
    gameSettings: CrocGameSettings = initialGameSettings,
    {
      painter,
      nextWordPicker,
    }: { painter?: string; nextWordPicker?: string } = {},
  ): void => {
    const initialData: CrocGameData = new CrocGameData();
    initialData.gameSettings = gameSettings;

    players.forEach((id) => {
      addPlayerToCrocData(initialData, { id });
    });

    if (painter) {
      initialData.painter = painter;
    }

    if (nextWordPicker) {
      initialData.nextWordPicker = nextWordPicker;
    }

    responder = new MockResponder();
    state = new WaitWordFromPlayerState({
      pickerPlayerId,
    });
    context = new SpyCrocGameContext(state, initialData, responder);
  };

  describe('with anything', () => {
    beforeEach(() => {
      initTestEnv('1', ['1', '2', '3', '4']);
    });

    test('should send next word demand to picker on enter ', () => {
      expect(responder.enqueueResponseForOne).toBeCalledWith(
        '1',
        actionMessageValidator('DEMAND_WORD', { variants: ['a', 'b'] }),
      );
    });

    test('should return to PrepareRoundState when picker disconnected', () => {
      disconnectPlayerFromStateContext(state, context, '1');

      expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
    });

    test('should return to PrepareRoundState if word was not picked in N seconds', async () => {
      await delay(initialGameSettings.secondsToPickWord * 1000 + 200);

      expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
    });

    test('should not return to PrepareRoundState if word was not picked in less than specified time', async () => {
      await delay(initialGameSettings.secondsToPickWord * 1 + 200);

      expect(context.setState).not.toBeCalled();
    });

    test('should return to PrepareRoundState and set word if word was picked', () => {
      state.triggerAction('PICK_WORD', Actions.pickWord('a'), '1');

      expect(context.data.word).toEqual('a');
      expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
    });

    test('should not return to PrepareRoundState and not set word if word was picked by anyone but picker', () => {
      state.triggerAction('PICK_WORD', Actions.pickWord('a'), '2');

      expect(context.data.word).toEqual(null);
      expect(context.setState).not.toBeCalled();
    });

    test('should not return to PrepareRoundState and not set word if word was picked not from variants', () => {
      state.triggerAction('PICK_WORD', Actions.pickWord('c'), '1');

      expect(context.data.word).toEqual(null);
      expect(context.setState).not.toBeCalled();
    });
  });

  describe('with oldPainterAnything setting', () => {
    beforeEach(() => {
      initTestEnv(
        '1',
        ['1', '2', '3', '4'],
        {
          ...initialGameSettings,
          nextWordPickType: 'oldPainterAnything',
        },
        { nextWordPicker: '1' },
      );
    });

    test('should send next word demand to picker without variants ', () => {
      expect(responder.enqueueResponseForOne).toBeCalledWith(
        '1',
        actionMessageValidator('DEMAND_WORD', { variants: undefined }),
      );
    });

    test('should reset nextWordPicker after timeout return to PrepareRoundState', async () => {
      await delay(initialGameSettings.secondsToPickWord * 1000 + 200);

      expect(context.data.nextWordPicker).toEqual(null);
    });

    test('should allow any word to be picked', () => {
      state.triggerAction('PICK_WORD', Actions.pickWord('duck'), '1');

      expect(context.data.word).toEqual('duck');
      expect(context.setState.mock.calls[0][0]).toBeInstanceOf(PickWordState);
    });
  });

  describe('with newPainterFromVariants setting', () => {
    beforeEach(() => {
      initTestEnv(
        '1',
        ['1', '2', '3', '4'],
        {
          ...initialGameSettings,
          nextWordPickType: 'newPainterFromVariants',
          numberOfWordVariants: 5,
        },
        { painter: '1' },
      );
    });

    test('should send next word demand to picker with specified number of variants ', () => {
      expect(responder.enqueueResponseForOne).toBeCalledWith(
        '1',
        actionMessageValidator('DEMAND_WORD', {
          variants: ['a', 'b', 'c', 'd', 'a'],
        }),
      );
    });

    test('should reset painter after timeout return to PrepareRoundState', async () => {
      await delay(initialGameSettings.secondsToPickWord * 1000 + 200);

      expect(context.data.painter).toEqual(null);
    });
  });

  describe('with oldPainterFromVariants setting', () => {
    beforeEach(() => {
      initTestEnv(
        '1',
        ['1', '2', '3', '4'],
        {
          ...initialGameSettings,
          nextWordPickType: 'oldPainterFromVariants',
          numberOfWordVariants: 5,
        },
        {
          nextWordPicker: '1',
        },
      );
    });

    test('should send next word demand to picker with specified number of variants ', () => {
      expect(responder.enqueueResponseForOne).toBeCalledWith(
        '1',
        actionMessageValidator('DEMAND_WORD', {
          variants: ['a', 'b', 'c', 'd', 'a'],
        }),
      );
    });

    test('should reset nextWordPicker after timeout return to PrepareRoundState', async () => {
      await delay(initialGameSettings.secondsToPickWord * 1000 + 200);

      expect(context.data.nextWordPicker).toEqual(null);
    });
  });
});
