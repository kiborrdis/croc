import React, { Component } from 'react';
import { connect, } from 'react-redux';
import { Actions } from 'croc-actions';
import { Store } from '../store';
import Messages from '../components/Messages';
import AnswerMessage from '../components/AnswerMessage';
import { Answer } from '../modules/answers';

interface AnswerContainerProps {
  messages: Answer[];
  proposeAnswer: typeof Actions.proposeAnswer;
}

class AnswersContainer extends Component<AnswerContainerProps> {
  handleNewMessage = (message: { text: string }) => {
    this.props.proposeAnswer({ answer: message.text });
  }

  render() {
    const { messages } = this.props;

    return (
      <Messages
        messages={messages}
        messageComponent={AnswerMessage}
        onNewMessage={this.handleNewMessage}
      />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    messages: store.answers,
  };
}

export default connect(mapStateToProps, {
  proposeAnswer: Actions.proposeAnswer,
})(AnswersContainer);
