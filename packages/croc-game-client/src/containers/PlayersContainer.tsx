import React from 'react';
import { connect, } from 'react-redux';
import { Store } from '../store';
import Players from '../components/Players';

const mapStateToProps = (store: Store) => {
  return {
    players: Object.keys(store.players).map(key => store.players[key]),
  };
}

export default connect(mapStateToProps)(Players);
