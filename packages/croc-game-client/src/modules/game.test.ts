import { Actions } from 'croc-actions';
import { reducer } from './game';

describe('Game reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    state = reducer(undefined, { type: 'bar' });
  })

  test('should return initial state', () => {
    expect(state).toEqual({
      roundStarted: false,
      leader: null,
      picker: null,
      secretWord: null,
    });
  });

  test('should start round on start round', () => {
    state = reducer(state, Actions.startRound());

    expect(state).toEqual({
      roundStarted: true,
      leader: null,
      picker: null,
      secretWord: null,
    });
  });

  test('should start round on start round and set secret word if it was passed', () => {
    state = reducer(state, Actions.startRound('word'));

    expect(state).toEqual({
      roundStarted: true,
      leader: null,
      picker: null,
      secretWord: 'word',
    });
  });

  test('should set leader if it was passed', () => {
    state = reducer(state, Actions.setLeader('leader'));

    expect(state).toEqual({
      roundStarted: false,
      leader: 'leader',
      picker: null,
      secretWord: null,
    });
  });


  test('should set picker if it was passed', () => {
    state = reducer(state, Actions.setPicker('picker'));

    expect(state).toEqual({
      roundStarted: false,
      leader: null,
      picker: 'picker',
      secretWord: null,
    });
  });

  test('should unset picker if it was passed', () => {
    state = reducer(state, Actions.setPicker('picker'));
    state = reducer(state, Actions.setPicker());

    expect(state).toEqual({
      roundStarted: false,
      leader: null,
      picker: null,
      secretWord: null,
    });
  });

  test('should unset all on round end', () => {
    state = reducer(state, Actions.setPicker('picker'));
    state = reducer(state, Actions.setLeader('leader'));
    state = reducer(state, Actions.startRound('word'));
    state = reducer(state, Actions.endRound());

    expect(state).toEqual({
      roundStarted: false,
      leader: null,
      picker: null,
      secretWord: null,
    });
  });
})