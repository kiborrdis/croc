import { Actions, ADD_DRAW_ACTIONS } from 'croc-actions';
import { ActionObject as DrawAction } from 'pixelizer';

export const reducer = (state: DrawAction[] = [], action: Actions) => {
  switch (action.type) {
    case ADD_DRAW_ACTIONS:
      let newDrawActions = action.payload;

      return [...state, ...newDrawActions];
    default:
      return state;
  }
}
