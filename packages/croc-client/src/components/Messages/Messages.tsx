import React, { FunctionComponent } from 'react';
import MessageList from './MessageList';
import NewMessage from './NewMessage';
import './Messages.css';

function Messages<M>(props: {
  messages: M[],
  messageComponent: FunctionComponent<M>,
  onNewMessage?: (message: { text: string }) => void,
}) {
  return (
    <div className="Messages">
      <div className="Message-content">
        <MessageList
          messages={props.messages}
          component={props.messageComponent} />
      </div>
      {props.onNewMessage && (
        <div className="Message-footer">
          <NewMessage onNewMessage={props.onNewMessage} />
        </div>
      )}
    </div>
  )
};

export default Messages;