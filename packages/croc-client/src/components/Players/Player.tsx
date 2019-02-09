import React from 'react';
import './Player.css';

interface PlayerProps {
  name: string;
  score: number;
};

const Player = (props: PlayerProps) => (
  <div>
    {`${props.name}: ${props.score}`}
  </div>
);

export default Player;
