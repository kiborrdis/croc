import {
  call, put, take, fork, takeEvery, actionChannel,
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga'
import { Actions as CrocActions} from 'croc-actions';
import { Actions, CONNECT_REQUEST, websocketMessage } from './actions';
import { AnyAction } from 'redux';
import { WebsocketConnection } from '../../utils/WebsocketConnection';

const connection = new WebsocketConnection('ws://localhost:8000/ws');

const createWebsocketMessageChannel = (connection: WebsocketConnection) => {
  return eventChannel(emitter => {
    connection.messageHandler = (message) => {
      emitter(message);
    };

    connection.closeHandler = () => {
      emitter(END);
    }

    return () => {
      connection.messageHandler = null;
      connection.closeHandler = null;
    }
  })
}

function* websocketChannelWatcher(watchedConnection: WebsocketConnection) {
  const websocketChannel = yield call(createWebsocketMessageChannel, watchedConnection);

  try {
    while (true) {
      const message = yield take(websocketChannel);

      yield call(messageHandlerSaga, message);
    }
  } finally {
    yield put(Actions.disconnect())
  }
}

function* syncActionsWatcher(syncConnection: WebsocketConnection) {
  const syncActionsChannel = yield actionChannel((action: any) => !!(action.meta && action.meta.sync));

  try {
    while (true) {
      const { type, payload } = yield take(syncActionsChannel);

      syncConnection.sendMessage({
        type: 'action',
        action: {
          type,
          payload,
        },
      })
    }
  } finally {}
}

function* messageHandlerSaga(message: any) {
  yield put(websocketMessage(message));
}

function* handleActionMessage(action: AnyAction) {
  yield put({ type: 'fff' });
}

function* connectSaga(action: Actions) {
  try {
    yield call(() => connection.open());
  } catch(e) {
    yield put(Actions.connectFailure());

    return;
  }

  yield put(Actions.connectSuccess());

  yield fork(websocketChannelWatcher, connection);
  yield fork(syncActionsWatcher, connection);
}

const actionMessagePredicate = (action: AnyAction): action is CrocActions => {
  return action.meta && action.meta.sync;
}

export function* saga() {
  yield takeEvery(CONNECT_REQUEST, connectSaga);
  yield takeEvery(actionMessagePredicate, handleActionMessage);
}
