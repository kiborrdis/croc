import { Message } from 'croc-messages';

export const DISCONNECTED_MESSAGE = 'disconnected';

export interface DisconnectedMessage extends Message<typeof DISCONNECTED_MESSAGE> {
  playerId: string;
}
