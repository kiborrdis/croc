import { Actions, ADD_CHAT_MESSAGES, ADD_ANSWERS } from 'croc-actions';

export interface Answer {
  id?: string,
  answer: string,
  right?: boolean,
  from?: string,
};

export const reducer = (state: Answer[] = [], action: Actions) => {
  switch (action.type) {
    case ADD_ANSWERS:
      let newAnswers = action.payload;

      if (action.syncData && action.syncData.from) {
        newAnswers = newAnswers.map(message => ({ ...message, from: action.syncData.from }));
      }

      return [...state, ...newAnswers];
    default:
      return state;
  }
}
