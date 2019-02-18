import React from 'react';
import Section from '../Section';
import classNames from 'classnames';
import './Player.css';

interface PlayerProps {
  name: string;
  score: number;
  disconnected?: boolean;
  leader: boolean;
  picker: boolean;
  isMe: boolean;
}

const Player = (props: PlayerProps) => (
  <Section tight>
    <div className={classNames('Player', {
      'is-disconnected': props.disconnected,
      'Player--me': props.isMe,
      })}>
      <img
        className='Player-image'
        src={`https://loremflickr.com/100/100/${props.name}?lock=1`}
        />

      <div className='Player-info'>
        <div className='Player-name'>
          {props.name}
        </div>
        <div className='Player-score'>
          {`${props.score} points`}
        </div>
      </div>
      <div className='Player-extra'>
        <div>{props.picker && 'Picking word'}</div>
        <div>{props.leader && 'Drawing'}</div>
      </div>
    </div>
  </Section>
);

export default Player;
