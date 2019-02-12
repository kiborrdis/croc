import { Message } from 'croc-messages';

export const DELETE_PLAYER_MESSAGE = 'deletePlayer';

export interface DeletePlayerMessage extends Message<typeof DELETE_PLAYER_MESSAGE> {
  playerId: string;
}
