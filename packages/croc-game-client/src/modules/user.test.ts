import { reducer, Actions, isAuthed } from './user';

describe('User reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    state = reducer(undefined, { type: 'bar' });
  });

  describe('reducer', () => {
    test('should return initial state', () => {
      expect(state).toEqual({});
    });

    test('should set name on setName', () => {
      const name = 'me';

      expect(reducer(state, Actions.setUsername(name))).toEqual({
        name,
      });
    });

    test('should replace user on set user', () => {
      const user = {
        name: 'you',
        playerId: 'ee',
      };
      const user1 = {
        name: 'me',
        playerId: 'ss',
      };

      state = reducer(state, Actions.setUser(user));
      expect(state).toEqual(user);

      state = reducer(state, Actions.setUser(user1));
      expect(state).toEqual(user1);
    });
  });

  describe('User selectors', () => {
    test('isAuth should be false when there is no name in state', () => {
      expect(isAuthed(state)).toBeFalsy();
    });

    test('isAuth should be true when there is name in state', () => {
      state.name = 'foo';

      expect(isAuthed(state)).toBeTruthy();
    });
  });

});
