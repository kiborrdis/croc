import { Actions } from 'croc-actions';

const ACTION_MESSAGE = 'action';
const INTRODUCTION_MESSAGE = 'introduction';

export interface ActionMessage {
  type: typeof ACTION_MESSAGE;
  action: Actions;
}

export interface IntroductionMessage {
  type: typeof INTRODUCTION_MESSAGE;
  name: string;
}

export function isActionMessage(message: any): message is ActionMessage {
  return message.type === ACTION_MESSAGE && message.action;
}

export function isIntroductionMessage(message: any): message is IntroductionMessage {
  return message.type === INTRODUCTION_MESSAGE;
}

export function buildActionMessage(action: Actions, from?: string): ActionMessage {
  return {
    type: 'action',
    action: {
      ...action,
      syncData: { from },
      meta: undefined,
    },
  };
}
