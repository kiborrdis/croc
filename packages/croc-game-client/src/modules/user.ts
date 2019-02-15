import { ActionsUnion, createAction } from 'croc-actions';
import {
  put, takeEvery,
} from 'redux-saga/effects';
import { isIntroductionMessage } from 'croc-messages';
import { WEBSOCKET_MESSAGE, WebsocketAction } from './connections';

export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER = 'SET_USER';

interface User {
  name?: string;
  playerId?: string;
}

export const Actions = {
  setUsername: (name: string) => createAction(SET_USER_NAME, name),
  setUser: (user: { name?: string, playerId?: string }) => createAction(SET_USER, user),
}

export type Actions = ActionsUnion<typeof Actions>;

const defaultUser = {
  name: process.env.NODE_ENV === 'development' ? Math.random().toString(36).substring(7) : undefined,
}

export const reducer = (state: User = defaultUser, action: Actions) => {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, name: action.payload };
    case SET_USER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function* introductionReceiverSaga(action: WebsocketAction) {
  if (isIntroductionMessage(action.payload)) {
    yield put(Actions.setUser({ name: action.payload.name, playerId: action.payload.playerId }))
  }
}

export function isAuthed(store: ReturnType<typeof reducer>): boolean {
  return !!store.name;
}

export function* saga() {
  yield takeEvery(WEBSOCKET_MESSAGE, introductionReceiverSaga);
}


