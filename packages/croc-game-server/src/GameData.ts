import { Player } from './interfaces/Player';

export class GameData {
  public players: { [id: string]: Player } = {};

  public get numberOfPlayers(): number {
    return Object.keys(this.players).length;
  }

  public get numberOfConnectedPlayers(): number {
    return Object.keys(this.players).filter(
      (id) => !this.players[id].disconnected,
    ).length;
  }
}
