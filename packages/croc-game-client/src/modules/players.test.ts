import { Actions } from 'croc-actions';
import { reducer } from './players';

describe('Players reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    state = reducer(undefined, { type: 'bar' });
  })

  test('should return initial state', () => {
    expect(state).toEqual({});
  });

  test('should add player with default score 0 on AddPlayers', () => {
    const newPlayers = [
      { id: 'a', name: 'you', },
      { id: 'b', name: 'me', score: 10 },
    ];

    expect(reducer(state, Actions.addPlayers(newPlayers))).toEqual({
      a: { id: 'a', name: 'you', score: 0 },
      b: { id: 'b', name: 'me', score: 10 },
    });
  });

  test('should extend player on AddPlayers if player already exists', () => {
    const newPlayers = [
      { id: 'a', name: 'you', },
      { id: 'b', name: 'me', score: 10 },
    ];
    const extendPlayer = [
      { id: 'a', name: 'john', score: 5 },
    ];

    state = reducer(state, Actions.addPlayers(newPlayers));

    expect(reducer(state, Actions.addPlayers(extendPlayer))).toEqual({
      a: { id: 'a', name: 'john', score: 5 },
      b: { id: 'b', name: 'me', score: 10 },
    });

  });

  test('should delete player with with passed id', () => {
    const newPlayers = [
      { id: 'a', name: 'you', },
      { id: 'b', name: 'me', score: 10 },
    ];

    state = reducer(state, Actions.addPlayers(newPlayers));
    state = reducer(state, Actions.deletePlayer('a'));

    expect(state).toEqual({
      b: { id: 'b', name: 'me', score: 10 },
    });
  });
})