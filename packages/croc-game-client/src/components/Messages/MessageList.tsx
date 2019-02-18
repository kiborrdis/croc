import React, { FunctionComponent } from 'react';
import './MessageList.css';

function MessagesList<M>(props: {
  messages: M[],
  component: FunctionComponent<M>,
}) {
  return (
    <div className='MessageList'>
      {
        props.messages.map((message, index) => (
          <props.component key={index} {...message} />
        ))
      }
    </div>
  );
}

export default MessagesList;
