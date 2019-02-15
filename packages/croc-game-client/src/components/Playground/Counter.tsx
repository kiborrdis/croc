import React, { Component } from 'react'

interface CounterProps {
  startTime: number;
  remainingTime: number;
};

interface CounterState {
  localTime: number;
};

export default class Counter extends Component<CounterProps, CounterState> {
  private counterTimeout?: NodeJS.Timeout;

  constructor(props: CounterProps) {
    super(props);

    this.state = {
      localTime: new Date().getTime(),
    };
  }

  componentDidMount() {
    this.countSecondIfNeeded();
  }

  componentDidUpdate() {
    this.countSecondIfNeeded();
  }

  componentWillUnmount() {
    if (this.counterTimeout) {
      clearTimeout(this.counterTimeout);
    }
  }

  countSecondIfNeeded() {
    if (this.state.localTime - this.props.startTime > this.props.remainingTime) {
      return;
    }

    this.counterTimeout = setTimeout(() => {
      this.setState({
        localTime: new Date().getTime(),
      });
    }, 1000);
  }

  get remainingTime() {
    return this.props.remainingTime - (this.state.localTime - this.props.startTime);
  }

  render() {
    return (
      <span>
        Remaining time: {Math.floor(this.remainingTime / 60000)}:{Math.floor((this.remainingTime % 60000) / 1000)}
      </span>
    );
  }
}