import React, { FunctionComponent } from 'react';
import Section from '../Section';
import MessageList from './MessageList';
import ApplicableInput from '../ApplicableInput';
import './Messages.css';

function Messages<M>(props: {
  messages: M[],
  messageComponent: FunctionComponent<M>,
  onNewMessage?: (text: string) => void,
}) {
  return (
    <Section tight className='Messages'>
      <div className='Message-content'>
        <MessageList
          messages={props.messages}
          component={props.messageComponent} />
      </div>
      {props.onNewMessage && (
        <div className='Message-footer'>
          <ApplicableInput onApply={props.onNewMessage} />
        </div>
      )}
    </Section>
  );
}

export default Messages;
