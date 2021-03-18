import { delayCall, setAfterCallHandler } from './DelayCall';

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

describe('DelayCall', () => {
  let testFn: () => {};
  let afterCallHandler: () => {};

  beforeEach(() => {
    testFn = jest.fn();
    afterCallHandler = jest.fn();

    setAfterCallHandler(afterCallHandler);
  });

  test('should call after call handler', async () => {
    const timeout = delayCall(testFn, 10);

    await delay(15);

    expect(testFn).toBeCalled();
    expect(afterCallHandler).toBeCalled();
  });

  test('should not call delayed call if it was canceled', async () => {
    const timeout = delayCall(testFn, 10);
    timeout.cancel();

    await delay(15);

    expect(testFn).not.toBeCalled();
    expect(afterCallHandler).not.toBeCalled();
  });
});
