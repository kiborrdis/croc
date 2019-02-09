import React from 'react';
import './Player.css';

interface PlayerProps {
  name: string;
  score: number;
};

const Player = (props: PlayerProps) => (
  <div className="Player">
    <img
      className="Player-image"
      src={`https://loremflickr.com/100/100/${props.name}?lock=1`}
      />

    <div className="Player-info">
      <div className="Player-name">
        {props.name}
      </div>
      <div className="Player-score">
        {`${props.score} points`}
      </div>
    </div>
  </div>
);

export default Player;
