import { Actions } from 'croc-actions';
import { reducer } from './answers';

describe('answers reducer', () => {
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    state = reducer(undefined, { type: 'bar' });
  });

  test('should return initial state', () => {
    expect(state).toEqual([]);
  });

  test('should add Answers on AddAnswers', () => {
    const newAnswers = [
      { answer: 'foo',
        id: 's',
      },
      { answer: 'baz',
        id: 's',
      },
    ];

    expect(reducer(state, Actions.addAnswers(newAnswers))).toEqual(newAnswers);
  });

  test('should add Answers on AddAnswers and keep the old ones', () => {
    const Answers1 = [
      { answer: 'foo',
        id: 's',
      },
      { answer: 'baz',
        id: 's',
      },
    ];
    const Answers2 = [
      { answer: 'beef',
        id: 's',
      },
    ];
    const tempState = reducer(state, Actions.addAnswers(Answers1));

    expect(reducer(tempState, Actions.addAnswers(Answers2))).toEqual([
      ...Answers1,
      ...Answers2,
    ]);
  });

  test('should add Answers on AddAnswers and append from to them if there is syncData', () => {
    const newAnswers = [
      { answer: 'foo',
        id: 's',
      },
      { answer: 'baz',
        id: 's',
      },
    ];
    const action = Actions.addAnswers(newAnswers);
    action.syncData = { from: 'me' };

    expect(reducer(state, action)).toEqual(
      newAnswers.map((msg) => ({ ...msg, from: 'me' })),
    );
  });

  test(`should prefer 'from' from answer over syncData`, () => {
    const newAnswers = [
      {
        answer: 'foo',
        id: 's',
      },
      {
        answer: 'baz',
        id: 's',
        from: 'you',
      },
    ];
    const action = Actions.addAnswers(newAnswers);
    action.syncData = { from: 'me' };

    expect(reducer(state, action)).toEqual([
      {
        answer: 'foo',
        id: 's',
        from: 'me',
      },
      {
        answer: 'baz',
        id: 's',
        from: 'you',
      },
    ]);
  });

  test('should empty all answers on start round', () => {
    const newAnswers = [
      {
        answer: 'foo',
        id: 's',
      },
      {
        answer: 'baz',
        id: 's',
      },
    ];

    state = reducer(state, Actions.addAnswers(newAnswers));
    state = reducer(state, Actions.startRound({ remainingTime: 10 }));

    expect(state).toEqual([]);
  });
});
