import React, { Component } from 'react';
import { connect,  } from 'react-redux';
import { Store } from '../store';
import Game from '../components/Game';
import { Actions } from '../modules/connections';

interface GameContainerProps {
  loaded: boolean;
  connect: typeof Actions.connectRequest,
}

class GameContainer extends Component<GameContainerProps> {
  componentDidMount() {
    const { connect } = this.props;

    connect(Math.random().toString(36).substring(7));
  }

  render() {
    const { loaded } = this.props;

    return (
      <Game loading={!loaded} />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    loaded: store.connection.status.connected,
  };
}

export default connect(mapStateToProps, {
  connect: Actions.connectRequest
})(GameContainer);
