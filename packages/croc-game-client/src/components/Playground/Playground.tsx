import React from 'react';
import { GameStatus } from '../../modules/game';
import CanvasContainer from '../../containers/CanvasContainer';
import PickWordContainer from '../../containers/PickWordContainer';
import Section from '../Section';
import Counter from './Counter';
import './Playground.css';

function renderCanvasContent(status: GameStatus) {
  if (status === GameStatus.started) {
    return <CanvasContainer />;
  } else if (status === GameStatus.waiting) {
    return <Section>Waiting</Section>;
  }

  return <PickWordContainer />;
}

interface PlaygroundProps {
  status: GameStatus;
  remainingTime: number;
  roundStartedAt: number;
  secretWord: string |  null;
}

const Playground = (props: PlaygroundProps) => {
  return (
    <div className='Playground'>
      {props.status === GameStatus.started && (
        <div className='Playground-header'>
          <Counter remainingTime={props.remainingTime} startTime={props.roundStartedAt} />
          {props.secretWord && <div>Draw the word: '{props.secretWord}'</div>}
        </div>
      )}
      {renderCanvasContent(props.status)}
    </div>
  );
};

export default Playground;
