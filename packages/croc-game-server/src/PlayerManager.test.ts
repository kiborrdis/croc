import { PlayerManager } from './PlayerManager';
import { NEW_PLAYER_MESSAGE } from './messages/NewPlayerMessage';
import {
  DisconnectedMessage,
  DISCONNECTED_MESSAGE,
} from './messages/DisconnectPlayerMessage';

describe('GameContext', () => {
  let manager: PlayerManager;
  let playerInfo = { name: 'Mark' };

  beforeEach(() => {
    manager = new PlayerManager();
  });

  test('should create without crashing', () => {});

  test('should return new player message based on passed info', () => {
    expect(manager.connectPlayerWithInfo(playerInfo)).toEqual({
      type: NEW_PLAYER_MESSAGE,
      player: {
        id: expect.stringMatching('[a-zA-Z\\-0-9]*'),
        name: playerInfo.name,
        disconnected: false,
      },
    });
  });

  test('should return disconnected player message based on playerId if player exist and connected', () => {
    const newPlayer = manager.connectPlayerWithInfo(playerInfo);

    expect(manager.disconnectPlayerWithId(newPlayer.player.id)).toEqual({
      type: DISCONNECTED_MESSAGE,
      playerId: newPlayer.player.id,
    });
  });

  test('should throw when disconnect based on playerId if player not exist', () => {
    try {
      manager.disconnectPlayerWithId('foo');
    } catch (e) {
      expect((e as Error).message).toBe(
        `Impossible to disconnect player 'foo', player does not exist`,
      );
    }
    expect(manager.disconnectPlayerWithId).toThrow();
  });

  test('should throw when disconnect based on playerId if player disconnected', () => {
    const newPlayer = manager.connectPlayerWithInfo(playerInfo);
    manager.disconnectPlayerWithId(newPlayer.player.id);

    try {
      manager.disconnectPlayerWithId(newPlayer.player.id);
    } catch (e) {
      expect((e as Error).message).toBe(
        `Impossible to disconnect player 'foo', player does not exist`,
      );
    }
  });
});
