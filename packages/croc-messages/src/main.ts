import { Actions } from 'croc-actions';

const ACTION_MESSAGE = 'action';
const INTRODUCTION_MESSAGE = 'introduction';

export interface Message<T extends string = string> {
  type: T;
}

export interface ActionMessage extends Message<typeof ACTION_MESSAGE> {
  action: Actions;
}

export interface IntroductionMessage
  extends Message<typeof INTRODUCTION_MESSAGE> {
  name: string;
  playerId?: string;
}

export function isActionMessage(message: unknown): message is ActionMessage {
  if (message && typeof message === 'object') {
    const { type, action } = message as { type: string; action: unknown };

    return type === ACTION_MESSAGE && !!action;
  }

  return false;
}

export function isIntroductionMessage(
  message: unknown,
): message is IntroductionMessage {
  if (message && typeof message === 'object') {
    const { type } = message as { type: string };

    return type === INTRODUCTION_MESSAGE;
  }

  return false;
}

export interface AnyMessage extends Message {
  [key: string]: unknown;
}

export function buildActionMessage(
  action: Actions,
  from?: string,
): ActionMessage {
  const actionToSend: Actions = {
    ...action,
    meta: undefined,
  };

  if (from) {
    actionToSend.syncData = { from };
  }

  return {
    type: ACTION_MESSAGE,
    action: actionToSend,
  };
}

export function buildIntroductionMessage(
  name: string,
  playerId?: string,
): IntroductionMessage {
  return {
    type: INTRODUCTION_MESSAGE,
    name,
    playerId,
  };
}
