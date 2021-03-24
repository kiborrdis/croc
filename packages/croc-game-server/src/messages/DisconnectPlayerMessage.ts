import { Message } from 'croc-messages';

export const DISCONNECTED_MESSAGE = 'disconnected';

export interface DisconnectedMessage
  extends Message<typeof DISCONNECTED_MESSAGE> {
  playerId: string;
}

export function createDisconnectPlayerMessage(
  playerId: string,
): DisconnectedMessage {
  return {
    type: DISCONNECTED_MESSAGE,
    playerId,
  };
}
