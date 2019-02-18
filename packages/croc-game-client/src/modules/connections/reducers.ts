import { combineReducers } from 'redux';
import { CONNECT_REQUEST, CONNECT_SUCCESS, CONNECT_FAILURE, DISCONNECT, Actions } from './actions';

function connectionStatusReducer(state = {
  connected: false,
  connecting: false,
},                               action: Actions) {
  switch (action.type) {
    case CONNECT_REQUEST: {
      return {
        connected: false,
        connecting: true,
      };
    }
    case CONNECT_SUCCESS: {
      return {
        connected: true,
        connecting: false,
      };
    }
    case CONNECT_FAILURE: {
      return {
        connected: false,
        connecting: false,
      };
    }
    case DISCONNECT: {
      return {
        connected: false,
        connecting: false,
      };
    }
    default: {
      return state;
    }
  }
}

function infoReducer(state: { name: string | null } = { name: null }, action: Actions) {
  switch (action.type) {
    case CONNECT_REQUEST: {
      return {
        name: action.payload.name,
      };
    }
    default: {
      return state;
    }
  }
}

export const reducer = combineReducers({
  status: connectionStatusReducer,
  info: infoReducer,
});
