import { Actions, ADD_DRAW_ACTIONS, START_ROUND } from 'croc-actions';
import { ActionObject as DrawAction } from 'pixelizer';

export const reducer = (state: DrawAction[] = [], action: Actions) => {
  switch (action.type) {
    case ADD_DRAW_ACTIONS:
      let newDrawActions = action.payload;

      return [...state, ...newDrawActions];
    case START_ROUND:
      return [];
    default:
      return state;
  }
}
