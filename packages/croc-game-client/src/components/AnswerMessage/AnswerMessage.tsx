import React from 'react';

const ChatMessage = (props: { answer: string }) => (
  <div>
    {props.answer}
  </div>
);

export default ChatMessage;
