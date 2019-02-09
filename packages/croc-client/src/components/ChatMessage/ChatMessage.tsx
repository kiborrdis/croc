import React from 'react';

const ChatMessage = (props: { text: string }) => (
  <div>
    {props.text}
  </div>
);

export default ChatMessage;