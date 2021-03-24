/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action as ReduxAction } from 'redux';

interface Action<T extends string, P, M> extends ReduxAction<T> {
  payload: P;
  meta: M;
  syncData?: any;
}

type FunctionType = (...args: any[]) => any;

interface ActionCreatorsMapObject {
  [actionCreator: string]: FunctionType;
}

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;

export function createAction<T extends keyof ActionTypeToAction>(
  type: T,
  payload: ActionTypeToAction[T]['payload'],
  meta: ActionTypeToAction[T]['meta'],
): Action<T, ActionTypeToAction[T]['payload'], ActionTypeToAction[T]['meta']> {
  return {
    type,
    payload,
    meta,
  };
}

export const SET_SETTINGS = 'SET_SETTINGS';
export const ADD_PLAYERS = 'ADD_PLAYERS';
export const DELETE_PLAYER = 'DELETE_PLAYER';
export const CHANGE_PLAYER_SCORE = 'CHANGE_PLAYER_SCORE';
export const ADD_ANSWERS = 'ADD_ANSWERS';
export const PROPOSE_ANSWER = 'PROPOSE_ANSWER';
export const ADD_CHAT_MESSAGES = 'ADD_CHAT_MESSAGES';
export const SET_PAINTER = 'SET_PAINTER';
export const SET_NEXT_WORD_PICKER = 'SET_NEXT_WORD_PICKER';
export const PICK_WORD = 'PICK_WORD';
export const START_ROUND = 'START_ROUND';
export const WAIT = 'WAIT';
export const END_ROUND = 'END_ROUND';
export const ADD_DRAW_ACTIONS = 'ADD_DRAW_ACTIONS';
export const UNDO_DRAW_ACTIONS = 'UNDO_DRAW_ACTIONS';

export type ActionType = keyof ActionTypeToAction;
export type ActionTypeToAction = {
  SET_SETTINGS: Action<'SET_SETTINGS', CrocGameSettings, undefined>;
  ADD_PLAYERS: Action<
    'ADD_PLAYERS',
    Array<{
      id: string;
      name?: string;
      score?: number;
      disconnected?: boolean;
    }>,
    SyncMeta
  >;
  DELETE_PLAYER: Action<'DELETE_PLAYER', string, undefined>;
  CHANGE_PLAYER_SCORE: Action<
    'CHANGE_PLAYER_SCORE',
    { id: string; newScore: number },
    SyncMeta
  >;
  ADD_ANSWERS: Action<
    'ADD_ANSWERS',
    Array<{ answer: string; right?: boolean; from?: string }>,
    SyncMeta
  >;
  PROPOSE_ANSWER: Action<'PROPOSE_ANSWER', string, SyncMeta>;
  ADD_CHAT_MESSAGES: Action<
    'ADD_CHAT_MESSAGES',
    Array<{ text: string; from?: string }>,
    SyncMeta
  >;
  SET_PAINTER: Action<'SET_PAINTER', string, undefined>;
  SET_NEXT_WORD_PICKER: Action<
    'SET_NEXT_WORD_PICKER',
    string | undefined,
    undefined
  >;
  DEMAND_WORD: Action<
    'DEMAND_WORD',
    {
      variants?: string[];
    },
    undefined
  >;
  PICK_WORD: Action<'PICK_WORD', string | undefined, SyncMeta>;
  START_ROUND: Action<
    'START_ROUND',
    { word?: string; remainingTime: number },
    undefined
  >;
  WAIT: Action<'WAIT', { type: 'settings' } | undefined, undefined>;
  END_ROUND: Action<'END_ROUND', undefined, undefined>;
  ADD_DRAW_ACTIONS: Action<'ADD_DRAW_ACTIONS', any[], SyncMeta>;
  UNDO_DRAW_ACTIONS: Action<'UNDO_DRAW_ACTIONS', any, undefined>;
};

type SyncMeta = { sync: boolean };

type NextPainterPickType = 'winner' | 'rotation' | 'random';
type NextWorkPickType =
  | 'random'
  | 'newPainterFromVariants'
  | 'oldPainterFromVariants'
  | 'oldPainterAnything';

type CrocGameSettings = {
  nextPainterPickType: NextPainterPickType;
  nextWordPickType: NextWorkPickType;

  // wordBase identifier or own base
  wordBase: string | { baseId: string };

  // for word pick type
  numberOfWordVariants: number;
};

export const Actions = {
  addPlayers: (
    players: Array<{
      id: string;
      name?: string;
      score?: number;
      disconnected?: boolean;
    }>,
  ) => {
    return createAction(ADD_PLAYERS, players, { sync: true });
  },
  deletePlayer: (playerId: string) => {
    return createAction(DELETE_PLAYER, playerId, undefined);
  },
  changePlayerScore: (player: { id: string; newScore: number }) => {
    return createAction(CHANGE_PLAYER_SCORE, player, { sync: true });
  },
  addAnswers: (
    answers: Array<{ answer: string; right?: boolean; from?: string }>,
  ) => {
    return createAction(ADD_ANSWERS, answers, { sync: true });
  },
  proposeAnswer: (answer: string) => {
    return createAction(PROPOSE_ANSWER, answer, { sync: true });
  },
  addChatMessages: (messages: Array<{ text: string; from?: string }>) => {
    return createAction(ADD_CHAT_MESSAGES, messages, { sync: true });
  },
  setPainter: (id: string) => {
    return createAction(SET_PAINTER, id, undefined);
  },
  setNextWordPicker: (id?: string) => {
    return createAction(SET_NEXT_WORD_PICKER, id, undefined);
  },
  demandWord: (variants?: string[]) => {
    return createAction('DEMAND_WORD', { variants }, undefined);
  },
  pickWord: (word?: string) => {
    return createAction(PICK_WORD, word, { sync: true });
  },
  startRound: (params: { word?: string; remainingTime: number }) => {
    return createAction(
      START_ROUND,
      {
        word: params.word,
        remainingTime: params.remainingTime,
      },
      undefined,
    );
  },
  endRound: () => {
    return createAction(END_ROUND, undefined, undefined);
  },
  wait: (params: { type: 'settings' } | undefined = undefined) => {
    return createAction(WAIT, params, undefined);
  },
  addDrawActions: (drawActions: any[]) => {
    return createAction(ADD_DRAW_ACTIONS, drawActions, { sync: true });
  },
  setSettings: (settings: CrocGameSettings) => {
    return createAction(SET_SETTINGS, settings, undefined);
  },
};

export type Actions = ActionsUnion<typeof Actions>;
