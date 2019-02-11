import uuid from 'uuid';
import { Message } from 'croc-messages';
import { Responder } from './interfaces/Responder';

export interface Player {
  id: string;
  name: string;
  score: number;
  disconnected?: boolean;
}

interface GameConfig {
  reconnectionTimeout: number;
  addPlayersMessageCreator: (players: Player[]) => Message;
  deletePlayerMessageCreator: (id: string) => Message;
}

interface IntroductionInfo {
  name: string;
}

export class Game {
  private config: GameConfig;
  private deleteTimeouts: { [id: string]: NodeJS.Timeout } = {};
  protected responder: Responder;
  protected players: { [id: string]: Player } = {};

  constructor(responder: Responder, config: GameConfig) {
    this.responder = responder;

    this.config = config;
  }

  public connectPlayerWithInfo(info: IntroductionInfo): string {
    const oldId = this.tryReconnect(info);

    if (oldId) {
      return oldId;
    }

    const newId = uuid();
    const newPlayer = { id: newId, name: info.name };

    this.players[newId] = { ...newPlayer, score: 0 };

    this.sendAllPlayersTo(newId);
    this.sendPlayer(newId);
    this.handleNewPlayer(newId);

    return newId;
  }

  private tryReconnect(info: IntroductionInfo): string | null {
    const oldPlayer = this.findPlayerByConnectionInfo(info);

    if (!oldPlayer) {
      return null;
    }

    oldPlayer.disconnected = false;

    this.sendPlayer(oldPlayer.id);

    clearTimeout(this.deleteTimeouts[oldPlayer.id]);
    delete this.deleteTimeouts[oldPlayer.id];

    return oldPlayer.id;
  }

  private findPlayerByConnectionInfo(info: IntroductionInfo): Player | null {
    const oldPlayerId = Object.keys(this.players).find(
      (id) => this.players[id].name === info.name,
    );

    if (oldPlayerId) {
      return this.players[oldPlayerId];
    }

    return null;
  }

  public disconnectPlayerWithId(id: string) {
    this.players[id].disconnected = true;

    this.sendPlayer(id);

    this.deleteTimeouts[id] = setTimeout(() => {
      this.sendDeletePlayer(id);
    }, this.config.reconnectionTimeout);
  }

  private sendPlayer(id: string) {
    if (this.players[id]) {
      this.responder.enqueueResponseForAll([
        this.config.addPlayersMessageCreator(
          [{ ...this.players[id] }],
        ),
      ]);
    }
  }

  private sendAllPlayersTo(id: string) {
    this.responder.enqueueResponseForOne(id, [
      this.config.addPlayersMessageCreator(
        Object.keys(this.players).map((playerId) => this.players[playerId]),
      ),
    ]);
  }

  private sendDeletePlayer(id: string) {
    this.responder.enqueueResponseForAll([
      this.config.deletePlayerMessageCreator(
        id,
      ),
    ]);
  }

  protected handleNewPlayer(playerId: string) {

  }

  public handleMessage(fromId: string, message: Message) {

  }
}
