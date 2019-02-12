import { buildActionMessage } from 'croc-messages';
import {
  CHANGE_PLAYER_SCORE,
  ADD_ANSWERS,
  ADD_CHAT_MESSAGES,
  ADD_DRAW_ACTIONS,
  SET_LEADER,
  SET_PICKER,
  START_ROUND,
  END_ROUND,
  WAIT,
  Actions,
} from 'croc-actions';
import { CrocGame } from './CrocGame';
import { CrocGameData } from './CrocGameData';
import { Responder } from './interfaces/Responder';

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

class MockResponder implements Responder {
  public enqueueResponseForAll = jest.fn();
  public enqueueResponseForOne = jest.fn();
  public enqueueResponseForAllButOne = jest.fn();
}

const config = {
  reconnectionTimeout: 10,
  pickWord: () => 'sadness',
  pickLeaderStrategy: (ids: string[]) => ids[0],
  timeForRound: 50,
};

const msgValidator = (type: any, payload: any, from?: string) => {
  const actionContent: { [k: string]: any } = { type, payload };

  if (from) {
    actionContent.syncData = { from };
  }

  return expect.arrayContaining([expect.objectContaining({
    type: 'action',
    action: expect.objectContaining(actionContent),
  })]);
};

test('Can create new game without throwing', () => {
  const game = new CrocGame({
    responder: new MockResponder(), config, gameDataInitializer: () => new CrocGameData(),
  });
});

describe('Game', () => {
  let id: string;
  let game: CrocGame;
  let responder: MockResponder;

  function messageToGame(senderId: string, action: Actions) {
    game.handleMessage(senderId, buildActionMessage(action));
  }

  function roundShouldNotStart(leaderId: string, word = 'sadness') {
    expect(responder.enqueueResponseForAllButOne).not.toBeCalledWith(
      leaderId,
      msgValidator(START_ROUND, {}),
    );
    expect(responder.enqueueResponseForOne).not.toBeCalledWith(
      leaderId,
      msgValidator(START_ROUND, { word }),
    );
  }

  function roundShouldStart(leaderId: string, word = 'sadness') {
    expect(responder.enqueueResponseForAllButOne).toBeCalledWith(
      leaderId,
      msgValidator(START_ROUND, {}),
    );
    expect(responder.enqueueResponseForOne).toBeCalledWith(
      leaderId,
      msgValidator(START_ROUND, { word }),
    );
  }

  beforeEach(() => {
    responder = new MockResponder();
    game = new CrocGame({responder, config, gameDataInitializer: () => new CrocGameData()});
    id = game.connectPlayerWithInfo({ name: 'Meow' });
  });

  describe('with single player', () => {
    test('send set leader action', () => {
      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(SET_LEADER, id));
    });

    test('pick word and start round on second player connection', () => {
      const secondId = game.connectPlayerWithInfo({ name: 'Mark' });

      roundShouldStart(id);
    });

    test('send leader when second player connected', () => {
      const secondId = game.connectPlayerWithInfo({ name: 'Mark' });

      expect(responder.enqueueResponseForOne).toBeCalledWith(secondId, msgValidator(SET_LEADER, id));
    });
  });

  describe('with two players and started round', () => {
    let secondId: string;

    beforeEach(() => {
      secondId = game.connectPlayerWithInfo({ name: 'Mark' });
    });

    test('broadcast chat message for everyone but sender', () => {
      messageToGame(id, Actions.addChatMessages([{ text: 'foo' }]));

      expect(responder.enqueueResponseForAllButOne).toBeCalledWith(id, msgValidator(
        ADD_CHAT_MESSAGES,
        [{ text: 'foo' }],
        id,
      ));
    });

    test('broadcast draw action message from leader for everyone but sender', () => {
      messageToGame(id, Actions.addDrawActions(['test']));

      expect(responder.enqueueResponseForAllButOne).toBeCalledWith(id, msgValidator(
        ADD_DRAW_ACTIONS,
        ['test'],
        id,
      ));
    });

    test('do not broadcast draw action message from not leader for everyone but sender', () => {
      messageToGame(secondId, Actions.addDrawActions(['test']));

      expect(responder.enqueueResponseForAllButOne).not.toBeCalledWith(secondId, msgValidator(
        ADD_DRAW_ACTIONS,
        ['test'],
        secondId,
      ));
    });

    test('broadcast proposed wrong answer for everyone', () => {
      messageToGame(secondId, Actions.proposeAnswer('test'));

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        ADD_ANSWERS,
        [{ answer: 'test', right: false }],
        secondId,
      ));
    });

    test('broadcast proposed right answer for everyone', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        ADD_ANSWERS,
        [{ answer: 'sadness', right: true }],
        secondId,
      ));
    });

    test('do not broadcast proposed answer if sent by leader', () => {
      messageToGame(id, Actions.proposeAnswer('test'));

      expect(responder.enqueueResponseForAll).not.toBeCalledWith(msgValidator(
        ADD_ANSWERS,
        [{ answer: 'test', right: false }],
        id,
      ));
    });

    test('end round if right answer was proposed', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        END_ROUND,
        undefined,
      ));
    });

    test('send player who guessed the word new leader', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        SET_LEADER,
        secondId,
      ));
    });

    test('send new scores on end round', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        CHANGE_PLAYER_SCORE,
        expect.objectContaining({ id: secondId }),
      ));
    });

    test('pick word and start round on end round', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      roundShouldStart(secondId);
    });
  });

  describe('with more than 2 players', () => {
    let secondId: string;
    let thirdId: string;

    beforeEach(() => {
      secondId = game.connectPlayerWithInfo({ name: 'Mark' });
      thirdId = game.connectPlayerWithInfo({ name: 'Wooof' });
    });

    test('should pass all chat messages to new player', () => {
      messageToGame(id, Actions.addChatMessages([{ text: 'one' }]));
      messageToGame(secondId, Actions.addChatMessages([{ text: 'two' }]));
      messageToGame(thirdId, Actions.addChatMessages([{ text: 'three' }, { text: 'four' }]));
      messageToGame(secondId, Actions.addChatMessages([{ text: 'five' }]));

      const fourthId = game.connectPlayerWithInfo({ name: 'qua' });

      expect(responder.enqueueResponseForOne).toBeCalledWith(fourthId, msgValidator(
        ADD_CHAT_MESSAGES,
        [
          { text: 'one', from: id },
          { text: 'two', from: secondId },
          { text: 'three', from: thirdId },
          { text: 'four', from: thirdId },
          { text: 'five', from: secondId },
        ],
        'server',
      ));
    });

    test('should pass all draw actions to new player', () => {
      messageToGame(id, Actions.addDrawActions(['test1']));
      messageToGame(id, Actions.addDrawActions(['test2']));
      messageToGame(id, Actions.addDrawActions(['test3']));
      messageToGame(id, Actions.addDrawActions(['test4']));

      const fourthId = game.connectPlayerWithInfo({ name: 'qua' });

      expect(responder.enqueueResponseForOne).toBeCalledWith(fourthId, msgValidator(
        ADD_DRAW_ACTIONS,
        [
          'test1',
          'test2',
          'test3',
          'test4',
        ],
        'server',
      ));
    });

    test('should pass all answers to new player', () => {
      messageToGame(secondId, Actions.proposeAnswer('test1'));
      messageToGame(thirdId, Actions.proposeAnswer('test2'));
      messageToGame(secondId, Actions.proposeAnswer('test3'));
      messageToGame(secondId, Actions.proposeAnswer('test4'));

      const fourthId = game.connectPlayerWithInfo({ name: 'qua' });

      expect(responder.enqueueResponseForOne).toBeCalledWith(fourthId, msgValidator(
        ADD_ANSWERS,
        [
          { answer: 'test1', right: false, from: secondId },
          { answer: 'test2', right: false, from: thirdId },
          { answer: 'test3', right: false, from: secondId },
          { answer: 'test4', right: false, from: secondId },
        ],
        'server',
      ));
    });

    test('should set picker after end round', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      expect(responder.enqueueResponseForOne).toBeCalledWith(
        id,
        msgValidator(SET_PICKER, id),
      );
    });

    test('should not start round after end round', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));

      roundShouldNotStart(secondId);
    });

    test('should start round if word was picked by picker', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));
      messageToGame(id, Actions.pickWord('grief'));

      roundShouldStart(secondId, 'grief');
    });

    test('should not start round if word was picked by not picker', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));
      messageToGame(thirdId, Actions.pickWord('grief'));

      roundShouldNotStart(secondId, 'grief');
    });

    test('should reset picker after end round', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));
      messageToGame(id, Actions.pickWord('grief'));
      messageToGame(thirdId, Actions.proposeAnswer('grief'));

      expect(responder.enqueueResponseForOne).toBeCalledWith(
        id,
        msgValidator(SET_PICKER, undefined),
      );
    });

    test('should ignore proposed answers from picker', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));
      messageToGame(id, Actions.pickWord('grief'));
      messageToGame(id, Actions.proposeAnswer('tsdtstdst'));

      expect(responder.enqueueResponseForAll).not.toBeCalledWith(msgValidator(
        ADD_ANSWERS,
        [{ answer: 'tsdtstdst', right: false }],
        id,
      ));
    });

    test('should start round if picker disconnected and didnt pick a word', () => {
      messageToGame(secondId, Actions.proposeAnswer('sadness'));
      game.disconnectPlayerWithId(id);

      roundShouldStart(secondId);
    });

    test('should end round and start a new one if leader disconnected', () => {
      game.disconnectPlayerWithId(id);

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        END_ROUND,
        undefined,
      ));
      roundShouldStart(secondId);
    });

    test('should send wait if only one player left', () => {
      game.disconnectPlayerWithId(thirdId);
      game.disconnectPlayerWithId(secondId);

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        END_ROUND,
        undefined,
      ));
      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        WAIT,
        undefined,
      ));
    });

    test('should end round if time has ended', async () => {
      await delay(config.timeForRound + 100);

      expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
        END_ROUND,
        undefined,
      ));
    });
  });
});
