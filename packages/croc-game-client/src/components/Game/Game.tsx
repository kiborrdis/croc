import React from 'react';
import ChatContainer from '../../containers/ChatContainer';
import AnswersContainer from '../../containers/AnswersContainer';
import CanvasContainer from '../../containers/CanvasContainer';
import PlayersContainer from '../../containers/PlayersContainer';
import DrawZoneContainer from '../../containers/DrawZoneContainer';
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
        <PlayersContainer />
      </div>

      <div className="Main">
        <DrawZoneContainer />

        <div className="Chats">
          <div className="Chat">
            <AnswersContainer />
          </div>
          <div className="Chat">
            <ChatContainer />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Game;
