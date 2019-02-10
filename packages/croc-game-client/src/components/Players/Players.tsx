import React from 'react';
import Player from './Player';
import './Players.css';

interface PlayersProps {
  players: Array<{ id: string, name: string, score: number }>,
};

const Players = (props: PlayersProps) => (
  <div className="Players">
    {
      props.players.map(({ id, ...rest }) => (
        <Player key={id} {...rest} />
      ))
    }
  </div>
);

export default Players;
