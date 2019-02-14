export interface DelayedCall {
  cancel: () => void;
}

let afterCallHandler = () => {};

export function setAfterCallHandler(handler: () => void) {
  afterCallHandler = handler;
}

export function delayCall(fn: () => void, time: number): DelayedCall {
  const timeoutDescr = setTimeout(() => {
    fn();

    afterCallHandler();
  }, time);

  return {
    cancel: () => {
      clearTimeout(timeoutDescr);
    },
  };
}
