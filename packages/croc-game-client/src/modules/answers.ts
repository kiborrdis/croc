import { Actions, START_ROUND, ADD_ANSWERS } from 'croc-actions';
import { Answer } from '../types/Answer';

export const reducer = (state: Answer[] = [], action: Actions) => {
  switch (action.type) {
    case ADD_ANSWERS:
      let newAnswers = action.payload;

      if (action.syncData && action.syncData.from) {
        newAnswers = newAnswers.map(message => ({ from: action.syncData.from, ...message, }));
      }

      return [...state, ...newAnswers];
    case START_ROUND:
      return [];
    default:
      return state;
  }
}
