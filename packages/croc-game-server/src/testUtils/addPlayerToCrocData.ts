import { CrocGameData } from '../CrocGameData';
import { Player } from '../interfaces/Player';

export const addPlayerToCrocData = (
  data: CrocGameData,
  player: { id: string } & Partial<Omit<Player, 'id'>>,
): Player => {
  const newPlayer = {
    name: 'unknown',
    score: 0,
    ...player,
  };
  data.players[player.id] = newPlayer;

  return newPlayer;
};
