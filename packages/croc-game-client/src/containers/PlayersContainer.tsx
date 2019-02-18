import React from 'react';
import { connect } from 'react-redux';
import { Store } from '../store';
import Players from '../components/Players';

const mapStateToProps = (store: Store) => {
  return {
    players: Object.keys(store.players).map((id) => ({
      ...store.players[id],
      leader: id === store.game.leader,
      picker: id === store.game.picker,
      isMe: id === store.user.playerId,
    })),
  };
};

export default connect(mapStateToProps)(Players);
