import React from 'react';
import { GameStatus } from '../../modules/game';
import CanvasContainer from '../../containers/CanvasContainer';
import PickWordContainer from '../../containers/PickWordContainer';
import Section from '../Section';
import './Playground.css';

function renderCanvasContent(status: GameStatus) {
  if (status === GameStatus.started) {
    return <CanvasContainer />;
  } else if (status === GameStatus.waiting) {
    return <Section>waiting</Section>;
  }

  return <PickWordContainer />;
}

const Playground = (props: { status: GameStatus }) => {

  return (
    <div className="Playground">
      {renderCanvasContent(props.status)}
    </div>
  );
};

export default Playground;
