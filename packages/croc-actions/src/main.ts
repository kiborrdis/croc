import { Action as ReduxAction } from 'redux';

interface Action<T extends string, P, M> extends ReduxAction<T> {
  payload: P;
  meta?: M;
  syncData?: any;
}

type FunctionType = (...args: any[]) => any;

interface ActionCreatorsMapObject {
  [actionCreator: string]: FunctionType;
}

interface AddMessageParams {
  text: string;
  service?: boolean;
}

interface SyncOptions {
  sync?: boolean;
}

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export function createAction<T extends string, P, M>(type: T, payload: P, meta?: M): Action<T, P, M> {
  return {
    type,
    payload,
    meta,
  };
}

export const ADD_PLAYERS = 'ADD_PLAYERS';
export const CHANGE_PLAYER_SCORE = 'CHANGE_PLAYER_SCORE';
export const ADD_ANSWERS = 'ADD_ANSWERS';
export const PROPOSE_ANSWER = 'PROPOSE_ANSWER';
export const ADD_CHAT_MESSAGES = 'ADD_CHAT_MESSAGES';
export const SET_LEADER = 'SET_LEADER';
export const START_ROUND = 'START_ROUND';
export const ADD_DRAW_ACTIONS = 'ADD_DRAW_ACTIONS';
export const UNDO_DRAW_ACTIONS = 'UNDO_DRAW_ACTIONS';

export const Actions = {
  addPlayers: (players: Array<{ id: string, name: string, score: number }>) => {
    return createAction(ADD_PLAYERS, players);
  },
  changePlayerScore: (player: { id: string, newScore: number }) => {
    return createAction(CHANGE_PLAYER_SCORE, player);
  },
  addAnswers: (answers: Array<{ id: string, answer: string, right?: boolean }>) => {
    return createAction(ADD_ANSWERS, answers);
  },
  proposeAnswer: (answer: { answer: string }) => {
    return createAction(PROPOSE_ANSWER, answer);
  },
  addChatMessages: (messages: Array<{ text: string }>) => {
    return createAction(ADD_CHAT_MESSAGES, messages)
  },
  setLeader: (id: string) => {
    return createAction(SET_LEADER, id);
  },
  startRound: () => {
    return createAction(START_ROUND, undefined);
  },
  // addDrawActions
};

export type Actions = ActionsUnion<typeof Actions>;
