import React, { RefObject, ChangeEvent, SyntheticEvent } from 'react';
import TextInput from '../TextInput';
import './ApplicableInput.css';

interface ApplicableInputProps {
  onApply: (message: { text: string }) => void;
  defaultValue?: string;
}

class ApplicableInput extends React.Component<ApplicableInputProps> {
  state = {
    value: '',
  }

  constructor(props: ApplicableInputProps) {
    super(props);

    if (props.defaultValue) {
      this.state.value = props.defaultValue;
    }
  }

  handleClick = () => {
    const { onApply } = this.props;

    if (this.state.value) {
      onApply({ text: this.state.value });

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
      <div className="ApplicableInput">
        <TextInput onChange={this.onChange} value={this.state.value} />
        <button onClick={this.handleClick}>Apply</button>
      </div>
    )
  }
}

export default ApplicableInput;
