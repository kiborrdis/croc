import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { Store } from '../store';
import Messages from '../components/Messages';
import AnswerMessage from '../components/AnswerMessage';
import { Answer } from '../types/Answer';

interface AnswerContainerProps {
  messages: Answer[];
  proposeAnswer: typeof Actions.proposeAnswer;
  canSendAnswer: boolean;
}

class AnswersContainer extends Component<AnswerContainerProps> {
  public handleNewMessage = (text: string) => {
    this.props.proposeAnswer(text);
  }

  public render() {
    const { messages, canSendAnswer } = this.props;

    return (
      <Messages
        messages={messages}
        messageComponent={AnswerMessage}
        onNewMessage={canSendAnswer ? this.handleNewMessage : undefined}
      />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    messages: store.answers,
    canSendAnswer: store.game.picker !== store.user.playerId && store.game.leader !== store.user.playerId,
  };
};

export default connect(mapStateToProps, {
  proposeAnswer: Actions.proposeAnswer,
})(AnswersContainer);
