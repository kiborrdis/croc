import { Actions, ADD_PLAYERS, DELETE_PLAYER, CHANGE_PLAYER_SCORE } from 'croc-actions';
import { Player } from '../types/Player';

export const reducer = (state: { [id: string]: Player } = {}, action: Actions) => {
  switch (action.type) {
    case ADD_PLAYERS:
      let newPlayers = action.payload.reduce((memo: { [id: string]: Player }, player) => {
        memo[player.id] = { score: 0, ...state[player.id], ...player };

        return memo;
      }, {});

      return { ...state, ...newPlayers };
    case DELETE_PLAYER: {
      const { [action.payload]: player, ...restPlayers } = state;

      return restPlayers;
    }
    case CHANGE_PLAYER_SCORE: {
      const { [action.payload.id]: player, ...restPlayers } = state;

      return { ...restPlayers, [player.id]: { ...player, score: action.payload.newScore } };
    }
    default:
      return state;
  }
}
