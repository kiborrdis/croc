import { Player } from './interfaces/Player';

export class GameData {
  public players: { [id: string]: Player } = {};
}
