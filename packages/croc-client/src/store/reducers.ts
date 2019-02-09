import { combineReducers } from 'redux';
import { reducer as connectionReducer } from '../modules/connections';
import { reducer as chatReducer } from '../modules/chatMessages';
import { reducer as answersReducer } from '../modules/answers';
import { reducer as playersReducer } from '../modules/players';
import { reducer as drawActionsReducer } from '../modules/drawActions';
import { reducer as userReducer } from '../modules/user';


export default combineReducers({
  connection: connectionReducer,
  chatMessages: chatReducer,
  answers: answersReducer,
  players: playersReducer,
  drawActions: drawActionsReducer,
  user: userReducer,
});
