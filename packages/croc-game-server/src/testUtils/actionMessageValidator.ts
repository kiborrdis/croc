import { ActionType, ActionTypeToAction } from 'croc-actions';

export const actionMessageValidator = <K extends ActionType>(
  type: K,
  payload: Partial<ActionTypeToAction[K]['payload']>,
  from?: string,
): any => {
  const actionContent: {
    type: K;
    payload: Partial<ActionTypeToAction[K]>;
    syncData?: { from: string };
  } = {
    type,
    payload,
  };

  if (from) {
    actionContent.syncData = { from };
  }

  return expect.arrayContaining([
    expect.objectContaining({
      type: 'action',
      action: expect.objectContaining(actionContent),
    }),
  ]);
};
