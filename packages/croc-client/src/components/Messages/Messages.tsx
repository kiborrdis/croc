import React, { FunctionComponent } from 'react';
import MessageList from './MessageList';
import ApplicableInput from '../ApplicableInput';
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
          <ApplicableInput onApply={props.onNewMessage} />
        </div>
      )}
    </div>
  )
};

export default Messages;