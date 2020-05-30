import { Player } from './interfaces/Player';
import { NewPlayerMessage, NEW_PLAYER_MESSAGE } from './messages/NewPlayerMessage';
import { DisconnectedMessage, DISCONNECTED_MESSAGE } from './messages/DisconnectPlayerMessage';
import uuid from 'uuid';

interface IntroductionInfo {
  name: string;
  id?: string;
}

export class PlayerManager {
  public players: { [id: string]: Player } = {};

  public connectPlayerWithInfo(info: IntroductionInfo): NewPlayerMessage {
    const newId = uuid();
    this.players[newId] = { id: newId, name: info.name, disconnected: false };

    return {
      type: NEW_PLAYER_MESSAGE,
      player: this.players[newId],
    };
  }

  public disconnectPlayerWithId(id: string): DisconnectedMessage {
    if (!this.players[id]) {
      throw new Error(`Impossible to disconnect player '${id}', player does not exist`);
    }

    this.players[id].disconnected = true;

    return {
      type: DISCONNECTED_MESSAGE,
      playerId: id,
    };
  }
}
