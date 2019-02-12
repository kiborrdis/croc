import { GameData } from './GameData';

export class CrocGameData extends GameData {
  public chatMessages: Array<{ text: string, from: string }> = [];
  public answers: Array<{ answer: string, right: boolean, from: string }> = [];
  public drawActions: any[] = [];
  public leader: string | null = null;
  public picker: string | null = null;
  public word: string | null = null;
  public roundInProgress: boolean = false;
  public pickWord: () => string = () => 'default';
  public pickLeaderStrategy: (playerIds: string[]) => string = (ids) => ids[0];
  public timePerRound: number = 100;
}
