import { Player } from './interfaces/Player';

export class GameData {
  public players: { [id: string]: Player } = {};

  public get numberOfPlayers() {
    return Object.keys(this.players).length;
  }

  public get numberOfConnectedPlayers() {
    return Object.keys(this.players).filter(
      (id) => !this.players[id].disconnected,
    ).length;
  }
}
