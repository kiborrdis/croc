import React, { Component } from 'react';
import { Provider } from 'react-redux'
import createStore from './store/createStore';
import GameContainer from './containers/GameContainer';
import AuthContainer from './containers/AuthContainer';
import './App.css';

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AuthContainer>
            <GameContainer />
          </AuthContainer>
        </div>
      </Provider>
    );
  }
}

export default App;
