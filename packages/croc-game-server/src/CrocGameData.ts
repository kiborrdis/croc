import { GameData } from './GameData';

export class CrocGameData extends GameData {
  public leader: string | null = null;
  public picker: string | null = null;
  public word: string | null = null;
  public roundInProgress: boolean = false;
}
