
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import sagas from './sagas';

export default function storeCreator() {
  // @ts-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();
  const enhancers = [
    applyMiddleware(sagaMiddleware),
  ];

  const store = createStore(rootReducer, {}, composeEnhancers(...enhancers));

  Object.keys(sagas).forEach((sagaKey: string) => {
    sagaMiddleware.run(sagas[sagaKey]);
  });

  return store;
}
