import { Message } from 'croc-messages';
import { Player } from '../interfaces/Player';

export const NEW_PLAYER_MESSAGE = 'newPlayer';

export interface NewPlayerMessage extends Message<typeof NEW_PLAYER_MESSAGE> {
  player: Player;
}

export function createNewPlayerMessage(player: Player): NewPlayerMessage {
  return {
    type: 'newPlayer',
    player,
  };
}
