import React, { Component } from 'react';
import { connect, } from 'react-redux';
import { Actions } from 'croc-actions';
import { Store } from '../store';
import Players from '../components/Players';
import AnswerMessage from '../components/AnswerMessage';

const mapStateToProps = (store: Store) => {
  return {
    players: Object.keys(store.players).map(key => store.players[key]),
  };
}

export default connect(mapStateToProps)(({ players }) => <Players players={players} />);
