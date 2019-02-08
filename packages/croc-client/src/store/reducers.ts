import { combineReducers } from 'redux';
import { reducer as connectionReducer } from '../modules/connections';
import { reducer as chatReducer } from '../modules/chatMessages';
import { reducer as answersReducer } from '../modules/answers';
import { reducer as playersReducer } from '../modules/players';

export default combineReducers({
  connection: connectionReducer,
  chatMessages: chatReducer,
  answers: answersReducer,
  players: playersReducer,
});
