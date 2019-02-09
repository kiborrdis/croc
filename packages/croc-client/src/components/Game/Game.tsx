import React from 'react';
import ChatContainer from '../../containers/ChatContainer';
import AnswersContainer from '../../containers/AnswersContainer';
import './Game.css';

interface GameProps {
  loading?: boolean;
};

const Game = (props: GameProps) => {
  const { loading } = props;

  if (loading) {
    return <span style={{ color: 'white' }}>loading</span>;
  }

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
          <AnswersContainer />

          <ChatContainer />
        </div>
      </div>

    </div>
  )
}

export default Game;
