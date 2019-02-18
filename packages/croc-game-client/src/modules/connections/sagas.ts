import {
  call, put, take, fork, takeEvery, actionChannel,
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { Actions as CrocActions} from 'croc-actions';
import { buildIntroductionMessage, buildActionMessage } from 'croc-messages';
import { Actions, CONNECT_REQUEST, WEBSOCKET_MESSAGE, websocketMessage, WebsocketAction } from './actions';
import { AnyAction } from 'redux';
import { WebsocketConnection } from '../../utils/WebsocketConnection';

const connection = new WebsocketConnection(process.env.REACT_APP_WS_CONNECTION_URL);

const createWebsocketMessageChannel = (wsConnection: WebsocketConnection) => {
  return eventChannel((emitter) => {
    wsConnection.messageHandler = (message) => {
      emitter(message);
    };

    wsConnection.closeHandler = () => {
      emitter(END);
    };

    return () => {
      wsConnection.messageHandler = null;
      wsConnection.closeHandler = null;
    };
  });
};

function* websocketChannelWatcher(watchedConnection: WebsocketConnection) {
  const websocketChannel = yield call(createWebsocketMessageChannel, watchedConnection);

  try {
    while (true) {
      const message = yield take(websocketChannel);

      yield call(messageHandlerSaga, message);
    }
  } finally {
    yield put(Actions.disconnect());
  }
}

const syncMessagePredicate = (action: AnyAction): action is CrocActions => {
  return !!(action.meta && action.meta.sync);
};

function* syncActionsWatcher(syncConnection: WebsocketConnection) {
  const syncActionsChannel = yield actionChannel(syncMessagePredicate);

  try {
    while (true) {
      const action: CrocActions = yield take(syncActionsChannel);

      syncConnection.sendMessage(buildActionMessage(action));
    }
  } catch (e) {}
}

function* messageHandlerSaga(message: any) {
  yield put(websocketMessage(message));
}

function* handleActionMessage(action: WebsocketAction) {
  yield put(action.payload.action);
}

function* connectSaga(action: ReturnType<typeof Actions.connectRequest>) {
  try {
    yield call(() => connection.open());
  } catch (e) {
    yield put(Actions.connectFailure());

    return;
  }

  connection.sendMessage(buildIntroductionMessage(action.payload.name));

  yield put(Actions.connectSuccess());

  yield fork(websocketChannelWatcher, connection);
  yield fork(syncActionsWatcher, connection);
}

const actionMessagePredicate = (action: AnyAction): action is WebsocketAction => {
  return action.type === WEBSOCKET_MESSAGE && action.payload.type === 'action';
};

export function* saga() {
  yield takeEvery(CONNECT_REQUEST, connectSaga);
  yield takeEvery(actionMessagePredicate, handleActionMessage);
}
