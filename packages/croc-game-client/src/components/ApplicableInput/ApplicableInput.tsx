import React, { ChangeEvent } from 'react';
import TextInput from '../TextInput';
import Button from '../Button';
import './ApplicableInput.css';

interface ApplicableInputProps {
  onApply: (text: string) => void;
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
      onApply(this.state.value);

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
        <Button onClick={this.handleClick} text="Apply" />
      </div>
    )
  }
}

export default ApplicableInput;
