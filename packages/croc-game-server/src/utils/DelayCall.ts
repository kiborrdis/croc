export interface DelayedCall {
  cancel: () => void;
}

let afterCallHandler: (() => void) | undefined;

export function setAfterCallHandler(handler: () => void): void {
  afterCallHandler = handler;
}

export function delayCall(fn: () => void, time: number): DelayedCall {
  const timeoutDescr = setTimeout(() => {
    fn();

    if (afterCallHandler) {
      afterCallHandler();
    }
  }, time);

  return {
    cancel: () => {
      clearTimeout(timeoutDescr);
    },
  };
}
