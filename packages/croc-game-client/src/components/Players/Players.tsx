import React from 'react';
import Player from './Player';
import { Player as PlayerType } from '../../types/Player';
import './Players.css';

interface PlayersProps {
  players: Array<PlayerType & { picker: boolean, leader: boolean, isMe: boolean }>,
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
