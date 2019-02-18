import React from 'react';

const ChatMessage = (props: { text: string, from?: string }) => (
  <div>
    {`${props.from ? props.from  : 'you'}: ${props.text}`}
  </div>
);

export default ChatMessage;
