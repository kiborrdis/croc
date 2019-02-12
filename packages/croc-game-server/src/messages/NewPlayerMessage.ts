import { Message } from 'croc-messages';

export const NEW_PLAYER_MESSAGE = 'newPlayer';

export interface NewPlayerMessage extends Message<typeof NEW_PLAYER_MESSAGE> {
  playerId: string;
}
