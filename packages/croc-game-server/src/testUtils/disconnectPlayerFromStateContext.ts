import { CrocGameContext } from '../CrocGameContext';
import { createDisconnectPlayerMessage } from '../messages/DisconnectPlayerMessage';
import { CrocGameState } from '../states/CrocGameState';

export const disconnectPlayerFromStateContext = (
  state: CrocGameState,
  context: CrocGameContext,
  playerId: string,
): void => {
  if (context.data.players[playerId]) {
    context.data.players[playerId].disconnected = true;
  }

  state.triggerAction(
    'playerDisconnected',
    createDisconnectPlayerMessage(playerId),
    'self',
  );
};
