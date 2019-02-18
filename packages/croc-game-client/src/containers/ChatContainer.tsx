import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { Store } from '../store';
import Messages from '../components/Messages';
import ChatMessageComponent from '../components/ChatMessage';
import { ChatMessage } from '../types/ChatMessage';

interface ChatContainerProps {
  messages: ChatMessage[];
  addMessages: typeof Actions.addChatMessages;
}

class ChatContainer extends Component<ChatContainerProps> {
  public handleNewMessage = (text: string) => {
    this.props.addMessages([{ text }]);
  }

  public render() {
    const { messages } = this.props;

    return (
      <Messages
        messages={messages}
        messageComponent={ChatMessageComponent}
        onNewMessage={this.handleNewMessage}
        />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    messages: store.chatMessages,
  };
};

export default connect(mapStateToProps, {
  addMessages: Actions.addChatMessages,
})(ChatContainer);
