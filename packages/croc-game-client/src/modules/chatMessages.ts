import { Actions, ADD_CHAT_MESSAGES } from 'croc-actions';
import { ChatMessage } from '../types/ChatMessage';

export const reducer = (state: ChatMessage[] = [], action: Actions) => {
  switch (action.type) {
    case ADD_CHAT_MESSAGES:
      let newMessages = action.payload;

      if (action.syncData && action.syncData.from) {
        newMessages = newMessages.map((message) => ({ from: action.syncData.from, ...message }));
      }

      return [ ...state, ...newMessages ];
    default:
      return state;
  }
};
