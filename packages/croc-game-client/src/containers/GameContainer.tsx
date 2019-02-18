import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Store } from '../store';
import Game from '../components/Game';
import { Actions } from '../modules/connections';

interface GameContainerProps {
  loaded: boolean;
  username?: string;
  connect: typeof Actions.connectRequest;
}

class GameContainer extends Component<GameContainerProps> {
  public componentDidMount() {
    const { connect: connectDispatch, username } = this.props;

    if (username) {
      connectDispatch(username);
    } else {
      throw new Error('Username in store is not defined');
    }
  }

  public render() {
    const { loaded } = this.props;

    return (
      <Game loading={!loaded} />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    loaded: store.connection.status.connected,
    username: store.user.name,
  };
};

export default connect(mapStateToProps, {
  connect: Actions.connectRequest,
})(GameContainer);
