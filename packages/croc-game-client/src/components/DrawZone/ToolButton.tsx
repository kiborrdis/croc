import React, { PureComponent } from 'react';

interface ToolButtonProps<V> {
  value: V;
  onClick: (value: V) => void;
  label: string;
  pressed?: boolean;
}

class ToolButton<V> extends PureComponent<ToolButtonProps<V>> {
  handleClick = () => {
    this.props.onClick(this.props.value);
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.label}</button>
    )
  }
}

export default ToolButton;
