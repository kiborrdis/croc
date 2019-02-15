import { Actions } from 'croc-actions';
import { reducer } from './drawActions';

describe('DrawActions reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    //@ts-ignore
    state = reducer(undefined, { type: 'foo' });
  });

  test('should return correct initial state', () => {
    expect(state).toEqual([]);
  });

  test('should add draw actions on add actions', () => {
    state = reducer(state, Actions.addDrawActions([
      { tool: { type: 'a' }, record: { type: 'b' } },
    ]));
    state = reducer(state, Actions.addDrawActions([
      { tool: { type: 'c' }, record: { type: 'e' } },
    ]));

    expect(state).toEqual([
      { tool: { type: 'a' }, record: { type: 'b' } },
      { tool: { type: 'c' }, record: { type: 'e' } },
    ]);
  });

  test('should clear draw actions on start round', () => {
    state = reducer(state, Actions.addDrawActions([
      { tool: { type: 'a' }, record: { type: 'b' } },
    ]));
    state = reducer(state, Actions.addDrawActions([
      { tool: { type: 'c' }, record: { type: 'e' } },
    ]));
    state = reducer(state, Actions.startRound());

    expect(state).toEqual([]);
  })
});