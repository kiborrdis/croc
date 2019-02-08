import { ActionsUnion, createAction } from 'croc-actions';


export const CONNECT_REQUEST = 'CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'CONNECT_SUCCESS';
export const CONNECT_FAILURE = 'CONNECT_FAILURE';
export const DISCONNECT = 'DISCONNECT';
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';


export const Actions = {
  connectRequest: (name: string) => createAction(CONNECT_REQUEST, { name }),
  connectSuccess: () => createAction(CONNECT_SUCCESS, undefined),
  connectFailure: () => createAction(CONNECT_FAILURE, undefined),
  disconnect: () => createAction(DISCONNECT, undefined),
}

export type Actions = ActionsUnion<typeof Actions>;

export const websocketMessage = (message: any) => createAction(WEBSOCKET_MESSAGE, message);
