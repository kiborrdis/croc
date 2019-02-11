import { buildActionMessage } from 'croc-messages';
import { ADD_PLAYERS, DELETE_PLAYER, Actions } from 'croc-actions';
import { Game, Player } from './Game';
import { Responder } from './interfaces/Responder';
import { arrayWith, objWith, anyOfStrings } from './testUtils/predicates';

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

class MockResponder implements Responder {
  public enqueueResponseForAll = jest.fn();
  public enqueueResponseForOne = jest.fn();
  public enqueueResponseForAllButOne = jest.fn();
}

const msgValidator = (content: any) => ([
  {
    type: 'mock',
    content,
  },
]);

const reconnectionTimeout = 10;
const config = {
  reconnectionTimeout,
  addPlayersMessageCreator: (players: Player[]) => ({
    type: 'mock',
    content: players.map((player) => ({ id: player.id, disconnected: player.disconnected })),
  }),
  deletePlayerMessageCreator: (id: string) => ({
    type: 'mock',
    content: id,
  }),
};

test('Can create new game without throwing', () => {
  const game = new Game(new MockResponder(), config);
});

describe('Game', () => {
  let id: string;
  let game: Game;
  let responder: MockResponder;

  beforeEach(() => {
    responder = new MockResponder();
    game = new Game(responder, config);
    id = game.connectPlayerWithInfo({ name: 'foo' });
  });

  test('should send new player to all players', () => {
    expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
      [ { id } ],
    ));
  });

  test('should send all players to new player', () => {
    const id2 = game.connectPlayerWithInfo({ name: 'foo1' });

    expect(responder.enqueueResponseForOne).toBeCalledWith(id2, msgValidator(
      [ { id }, { id: id2 } ],
    ));
  });

  test('should send disconnected player to all players message when disconnect', () => {
    game.disconnectPlayerWithId(id);

    expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
      [{ id, disconnected: true }],
    ));
  });

  test('should send delete player after set timeout after player disconnect', async () => {
    game.disconnectPlayerWithId(id);

    await delay(reconnectionTimeout + 10);

    expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
      id,
    ));
  });

  test('should not send delete player after set timeout after player reconnect', async () => {
    game.disconnectPlayerWithId(id);
    game.connectPlayerWithInfo({ name: 'foo' });

    await delay(reconnectionTimeout + 10);

    expect(responder.enqueueResponseForAll).not.toBeCalledWith(msgValidator(
      id,
    ));
  });

  test(`should send player after reconnect `, async () => {
    game.disconnectPlayerWithId(id);
    game.connectPlayerWithInfo({ name: 'foo' });

    await delay(reconnectionTimeout + 10);

    expect(responder.enqueueResponseForAll).toBeCalledWith(msgValidator(
      [{ id, disconnected: false }],
    ));
  });
});
