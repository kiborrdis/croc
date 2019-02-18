import { Actions } from 'croc-actions';
import { reducer } from './game';

describe('Game reducer', () => {
  let state: ReturnType<typeof reducer>;
  const initialState = {
    roundStartedAt: 0,
    remainingTimeFromStart: 0,
    leader: null,
    picker: null,
    secretWord: null,
  };

  beforeEach(() => {
    // @ts-ignore
    state = reducer(undefined, { type: 'bar' });
  });

  test('should return initial state', () => {
    expect(state).toEqual(initialState);
  });

  test('should start round on start round', () => {
    state = reducer(state, Actions.startRound({ remainingTime: 10 }));

    expect(state).toEqual({
      ...initialState,
      roundStartedAt: expect.anything(),
      remainingTimeFromStart: 10,
    });
    // TODO mock Date ffs
    expect(state.roundStartedAt / 100).toBeCloseTo(new Date().getTime() / 100, 0);
  });

  test('should start round on start round and set secret word if it was passed', () => {
    state = reducer(state, Actions.startRound({ remainingTime: 10, word: 'word' }));

    expect(state).toEqual({
      ...initialState,
      roundStartedAt: expect.anything(),
      remainingTimeFromStart: 10,
      secretWord: 'word',
    });
    expect(state.roundStartedAt / 100).toBeCloseTo(new Date().getTime() / 100, 0);
  });

  test('should set leader if it was passed', () => {
    state = reducer(state, Actions.setLeader('leader'));

    expect(state).toEqual({
      ...initialState,
      leader: 'leader',
    });
  });

  test('should set picker if it was passed', () => {
    state = reducer(state, Actions.setPicker('picker'));

    expect(state).toEqual({
      ...initialState,
      picker: 'picker',
    });
  });

  test('should unset picker if it was passed', () => {
    state = reducer(state, Actions.setPicker('picker'));
    state = reducer(state, Actions.setPicker());

    expect(state).toEqual(initialState);
  });

  test('should unset all on round end', () => {
    state = reducer(state, Actions.setPicker('picker'));
    state = reducer(state, Actions.setLeader('leader'));
    state = reducer(state, Actions.startRound({ remainingTime: 10, word: 'word' }));
    state = reducer(state, Actions.endRound());

    expect(state).toEqual(initialState);
  });
});
