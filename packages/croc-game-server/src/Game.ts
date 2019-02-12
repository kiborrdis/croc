import uuid from 'uuid';
import { Message } from 'croc-messages';
import { Responder } from './interfaces/Responder';
import { Player } from './interfaces/Player';
import { GameData } from './GameData';
import { GameContext } from './GameContext';
import { GameState } from './states/GameState';

interface GameConfig {
  reconnectionTimeout: number;
  addPlayersMessageCreator: (players: Player[]) => Message;
  deletePlayerMessageCreator: (id: string) => Message;
}

interface IntroductionInfo {
  name: string;
}

export class Game<D extends GameData = GameData> {
  private config: GameConfig;
  private deleteTimeouts: { [id: string]: NodeJS.Timeout } = {};
  protected responder: Responder;
  protected data: D;
  protected context: GameContext<D>;

  constructor(params: { responder: Responder, config: GameConfig, gameDataInitializer: () => D }) {
    this.responder = params.responder;
    this.config = params.config;
    this.data = params.gameDataInitializer();
    this.context = this.initializeContext();
  }

  protected initializeContext() {
    const state = new GameState<D>();

    return new GameContext<D>(state, this.data, this.responder);
  }

  public connectPlayerWithInfo(info: IntroductionInfo): string {
    const oldId = this.tryReconnect(info);

    if (oldId) {
      return oldId;
    }

    const newId = uuid();
    const newPlayer = { id: newId, name: info.name };

    this.data.players[newId] = { ...newPlayer, score: 0 };

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
    const oldPlayerId = Object.keys(this.data.players).find(
      (id) => this.data.players[id].name === info.name,
    );

    if (oldPlayerId) {
      return this.data.players[oldPlayerId];
    }

    return null;
  }

  public disconnectPlayerWithId(id: string) {
    this.data.players[id].disconnected = true;

    this.sendPlayer(id);
    this.handleDisconnectedPlayer(id);

    this.deleteTimeouts[id] = setTimeout(() => {
      this.sendDeletePlayer(id);
    }, this.config.reconnectionTimeout);
  }

  private sendPlayer(id: string) {
    if (this.data.players[id]) {
      this.responder.enqueueResponseForAll([
        this.config.addPlayersMessageCreator(
          [{ ...this.data.players[id] }],
        ),
      ]);
    }
  }

  private sendAllPlayersTo(id: string) {
    this.responder.enqueueResponseForOne(id, [
      this.config.addPlayersMessageCreator(
        Object.keys(this.data.players).map((playerId) => this.data.players[playerId]),
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

  protected get numberOfPlayers() {
    return Object.keys(this.data.players).length;
  }

  protected get numberOfConnectedPlayers() {
    return Object.keys(this.data.players).filter((id) => !this.data.players[id].disconnected).length;
  }

  protected handleNewPlayer(playerId: string) {

  }

  protected handleDisconnectedPlayer(playerId: string) {

  }

  protected handleDeletedPlayer(playerId: string) {

  }

  public handleMessage(fromId: string, message: Message) {

  }
}
