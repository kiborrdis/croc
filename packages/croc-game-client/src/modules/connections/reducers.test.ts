import { reducer } from './reducers';
import { Actions } from './actions';

describe('connection reducer', () => {
  let initialState: ReturnType<typeof reducer>;

  beforeEach(() => {
    initialState = reducer(undefined, { type: 'bar' });
  })

  test('should return initial state', async () => {
    expect(initialState).toEqual({
      info: { name: null },
      status: { connected: false, connecting: false },
    });
  });

  test('should set name and reset to connecting on connection request', () => {
    initialState.status.connected = true;

    const state = reducer(initialState, Actions.connectRequest('name'));


    expect(state).toEqual({
      info: { name: 'name' },
      status: { connected: false, connecting: true },
    });
  });

  test('should set connecting and connected status on connection success', () => {
    initialState.status.connecting = true;

    const state = reducer(initialState, Actions.connectSuccess());

    expect(state.info).toBe(initialState.info);
    expect(state.status).toEqual({ connected: true, connecting: false });
  });

  test('should reset "connected" on connection failure', () => {
    initialState.status.connected = true;

    const state = reducer(initialState, Actions.connectFailure());

    expect(state.info).toBe(initialState.info);
    expect(state.status).toEqual({ connected: false, connecting: false });
  });

  test('should reset "connecting" on connection failure', () => {
    initialState.status.connecting = true;

    const state = reducer(initialState, Actions.connectFailure());

    expect(state.info).toBe(initialState.info);
    expect(state.status).toEqual({ connected: false, connecting: false });
  });

  test('should reset "connected" on disconnect', () => {
    initialState.status.connected = true;

    const state = reducer(initialState, Actions.disconnect());

    expect(state.info).toBe(initialState.info);
    expect(state.status).toEqual({ connected: false, connecting: false });
  });
});
