import { Actions, START_ROUND, SET_LEADER, SET_PICKER, END_ROUND } from 'croc-actions';
import { Store } from '../store';

export enum GameStatus {
  waiting,
  started,
  picking,
}

export interface Game {
  roundStartedAt: number;
  remainingTimeFromStart: number;
  leader: string | null;
  picker: string | null;
  secretWord: string | null;
}

export const reducer = (state: Game = {
  roundStartedAt: 0,
  remainingTimeFromStart: 0,
  leader: null,
  picker: null,
  secretWord: null,
},                      action: Actions) => {
  switch (action.type) {
    case START_ROUND: {
      return {
        ...state,
        roundStartedAt: new Date().getTime(),
        remainingTimeFromStart: action.payload.remainingTime,
        secretWord: action.payload.word || null,
      };
    }
    case SET_LEADER: {
      return {
        ...state,
        leader: action.payload,
      };
    }
    case SET_PICKER: {
      return {
        ...state,
        picker: action.payload || null,
      };
    }
    case END_ROUND: {
      return {
        roundStartedAt: 0,
        remainingTimeFromStart: 0,
        leader: null,
        picker: null,
        secretWord: null,
      };
    }
    default:
      return state;
  }
};

export function getGameStatus(store: Store): GameStatus {
  let status: GameStatus;

  if (Object.keys(store.players).filter((id) => !store.players[id].disconnected).length < 2) {
    status = GameStatus.waiting;
  } else if (store.game.roundStartedAt) {
    status = GameStatus.started;
  } else {
    status = GameStatus.picking;
  }

  return status;
}
