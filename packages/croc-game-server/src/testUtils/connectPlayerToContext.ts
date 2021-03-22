import { CrocGameContext } from '../CrocGameContext';
import { Player } from '../interfaces/Player';
import { createNewPlayerMessage } from '../messages/NewPlayerMessage';
import { CrocGameState } from '../states/CrocGameState';

export const connectPlayerToStateContext = (
  state: CrocGameState,
  context: CrocGameContext,
  player: { id: string } & Partial<Omit<Player, 'id'>>,
): void => {
  const newPlayer = {
    name: 'unknown',
    score: 0,
    ...player,
  };
  context.data.players[player.id] = newPlayer;
  state.handleMessage('self', createNewPlayerMessage(newPlayer));
};
