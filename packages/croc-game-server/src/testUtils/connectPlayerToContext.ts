import { CrocGameContext } from '../CrocGameContext';
import { Player } from '../interfaces/Player';
import { createNewPlayerMessage } from '../messages/NewPlayerMessage';
import { CrocGameState } from '../states/CrocGameState';
import { addPlayerToCrocData } from './addPlayerToCrocData';

export const connectPlayerToStateContext = (
  state: CrocGameState,
  context: CrocGameContext,
  player: { id: string } & Partial<Omit<Player, 'id'>>,
): void => {
  const newPlayer = addPlayerToCrocData(context.data, player);

  state.triggerAction(
    'playerConnected',
    createNewPlayerMessage(newPlayer),
    'self',
  );
};
