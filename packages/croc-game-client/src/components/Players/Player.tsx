import React from 'react';
import Section from '../Section';
import classNames from 'classnames';
import './Player.css';

interface PlayerProps {
  name: string;
  score: number;
  disconnected?: boolean;
};

const Player = (props: PlayerProps) => (
  <Section className={classNames('Player', { 'is-disconnected': props.disconnected })}>
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
  </Section>
);

export default Player;
