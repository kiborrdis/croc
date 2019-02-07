import { Action as ReduxAction } from 'redux';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_DRAW_ACTION = 'ADD_DRAW_ACTION';

interface Action<T extends string, P, M> extends ReduxAction<T> {
  payload?: P;
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

export function createAction<T extends string, P, M>(type: T, payload?: P, meta?: M): Action<T, P, M> {
  return {
    type,
    payload,
    meta,
  };
}

export const Actions = {
  addMessage: (params: AddMessageParams, options: SyncOptions = {}) => {
    const payload = { text: params.text, service: params.service };

    return createAction(ADD_MESSAGE, payload, { sync: true });
  },
  addDrawAction: (num: number) => createAction(ADD_DRAW_ACTION, num),
};

export type Actions = ActionsUnion<typeof Actions>;
