import React, { RefObject } from 'react';
import './NewMessage.css';

class NewMessage extends React.Component<{
  onNewMessage: (message: { text: string }) => void;
}> {
  inputRef: RefObject<HTMLInputElement> = React.createRef();

  handleClick = () => {
    if (this.inputRef.current) {
      const { onNewMessage } = this.props;

      onNewMessage({ text: this.inputRef.current.value });
    }
  }

  render() {
    return (
      <div className="NewMessage">
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>Apply</button>
      </div>
    )
  }
}

export default NewMessage;
