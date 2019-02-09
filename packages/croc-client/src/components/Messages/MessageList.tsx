import React, { FunctionComponent } from 'react';

function MessagesList<M>(props: {
  messages: M[],
  component: FunctionComponent<M>
}) {
  return (
    <div>
      {
        props.messages.map((message, index) => (
          <props.component key={index} {...message} />
        ))
      }
    </div>
  );
}

export default MessagesList;
