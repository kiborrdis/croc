import { Actions } from 'croc-actions';
import { reducer } from './answers';

describe('answers reducer', () => {
  let initialState: ReturnType<typeof reducer>;

  beforeEach(() => {
    // @ts-ignore
    initialState = reducer(undefined, { type: 'bar' });
  })

  test('should return initial state', () => {
    expect(initialState).toEqual([]);
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

    expect(reducer(initialState, Actions.addAnswers(newAnswers))).toEqual(newAnswers);
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
    const tempState = reducer(initialState, Actions.addAnswers(Answers1));

    expect(reducer(tempState, Actions.addAnswers(Answers2))).toEqual([
      ...Answers1,
      ...Answers2,
    ]);
  })


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

    expect(reducer(initialState, action)).toEqual(
      newAnswers.map(msg => ({ ...msg, from: 'me' }))
    );
  });
})