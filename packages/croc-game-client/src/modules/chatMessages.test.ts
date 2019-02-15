import { Actions } from 'croc-actions';
import { reducer } from './chatMessages';

describe('chatMessages reducer', () => {
  let initialState: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    initialState = reducer(undefined, { type: 'bar' });
  })

  test('should return initial state', () => {
    expect(initialState).toEqual([]);
  });

  test('should add messages on AddMessages', () => {
    const newMessages = [
      { text: 'foo' },
      { text: 'baz' },
    ];

    expect(reducer(initialState, Actions.addChatMessages(newMessages))).toEqual(newMessages);
  });

  test('should add messages on AddMessages and keep the old ones', () => {
    const messages1 = [
      { text: 'foo' },
      { text: 'baz' },
    ];
    const messages2 = [
      { text: 'beef' },
    ];
    const tempState = reducer(initialState, Actions.addChatMessages(messages1));

    expect(reducer(tempState, Actions.addChatMessages(messages2))).toEqual([
      ...messages1,
      ...messages2,
    ]);
  })


  test('should add messages on AddMessages and append from to them if there is syncData', () => {
    const newMessages = [
      { text: 'foo' },
      { text: 'baz' },
    ];
    const action = Actions.addChatMessages(newMessages);
    action.syncData = { from: 'me' };

    expect(reducer(initialState, action)).toEqual(
      newMessages.map(msg => ({ ...msg, from: 'me' }))
    );
  });

  test('should add messages on AddMessages and append from to them if there is syncData', () => {
    const newMessages = [
      { text: 'foo' },
      { text: 'baz' },
    ];
    const action = Actions.addChatMessages(newMessages);
    action.syncData = { from: 'me' };

    expect(reducer(initialState, action)).toEqual(
      newMessages.map(msg => ({ ...msg, from: 'me' }))
    );
  });

  test(`should prefer 'from' from message over syncData`, () => {
    const newMessages = [
      { text: 'foo', from: 'you' },
      { text: 'baz' },
    ];
    const action = Actions.addChatMessages(newMessages);
    action.syncData = { from: 'me' };

    expect(reducer(initialState, action)).toEqual([
      { text: 'foo', from: 'you' },
      { text: 'baz', from: 'me' },
    ]);
  });
})