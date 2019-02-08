import React, { Component } from 'react';
import { Provider } from 'react-redux'
import createStore from './store/createStore';
import Game from './components/Game';
import './App.css';

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Game />
        </div>
      </Provider>
    );
  }
}

export default App;
