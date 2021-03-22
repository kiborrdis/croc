import { GameData } from './GameData';

type NextPainterPickType = 'winner' | 'rotation' | 'random';
type NextWorkPickType =
  | 'random'
  | 'newPainterFromVariants'
  | 'oldPainterFromVariants'
  | 'newPainterAnything';

type CrocGameSettings = {
  nextPainterPickType: NextPainterPickType;
  nextWordPickType: NextWorkPickType;

  // wordBase identifier or own base,
  wordBase: string | string[];

  // for word pick type
  numberOfWordVariants: number;
};

export class CrocGameData extends GameData {
  public chatMessages: Array<{ text: string; from: string }> = [];
  public answers: Array<{ answer: string; right: boolean; from: string }> = [];
  public drawActions: unknown[] = [];
  public painter: string | null = null;
  public nextWordPicker: string | null = null;
  public word: string | null = null;
  public roundStartedAt = 0;
  public pickWord: () => string = () => 'default';
  public pickLeaderStrategy: (playerIds: string[]) => string = (ids) => ids[0];
  public timePerRound = 100;

  public gameSettings?: CrocGameSettings;
}
