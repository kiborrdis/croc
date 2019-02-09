import React, { RefObject, ChangeEvent, SyntheticEvent } from 'react';
import TextInput from '../TextInput';
import './NewMessage.css';

interface NewMessageProps {
  onNewMessage: (message: { text: string }) => void;
  defaultValue?: string;
}

class NewMessage extends React.Component<NewMessageProps> {
  state = {
    value: '',
  }

  constructor(props: NewMessageProps) {
    super(props);

    if (props.defaultValue) {
      this.state.value = props.defaultValue;
    }
  }

  handleClick = () => {
    const { onNewMessage } = this.props;

    if (this.state.value) {
      onNewMessage({ text: this.state.value });

      this.setState({ value: '' });
    }
  }

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.currentTarget.value,
    });
  }

  render() {
    return (
      <div className="NewMessage">
        <TextInput onChange={this.onChange} value={this.state.value} />
        <button onClick={this.handleClick}>Apply</button>
      </div>
    )
  }
}

export default NewMessage;
