import React from 'react';
import './Game.css';

interface GameProps {
  loading?: boolean;
};

const Game = (props: GameProps) => {
  const { loading } = props;

  return (
    <div className="Game">
      <div className="Sidebar">
        <div className="Players">
        </div>
      </div>

      <div className="Main">

        <div className="DrawZone">
          <div className="Canvas">
          </div>
          <div className="Tools">
          </div>
        </div>

        <div className="Chats">
          <div className="Answers">
          </div>

          <div className="Chat">
          </div>
        </div>
      </div>

    </div>
  )
}

export default Game;
