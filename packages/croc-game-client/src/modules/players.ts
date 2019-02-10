import { Actions, ADD_CHAT_MESSAGES, ADD_ANSWERS, ADD_PLAYERS } from 'croc-actions';

export interface Player {
  id: string,
  name: string,
  score?: number,
};

export const reducer = (state: { [id: string]: Player } = {}, action: Actions) => {
  switch (action.type) {
    case ADD_PLAYERS:
      let newPlayers = action.payload.reduce((memo: { [id: string]: Player }, player) => {
        memo[player.id] = { score: 0, ...state[player.id], ...player };

        return memo;
      }, {});

      return { ...state, ...newPlayers };
    default:
      return state;
  }
}
