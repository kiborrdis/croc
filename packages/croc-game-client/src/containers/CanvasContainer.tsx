import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { ActionObject as DrawAction } from 'pixelizer';
import { Store } from '../store';
import Canvas from '../components/Canvas';

interface CanvasContainerProps {
  drawActions: DrawAction[];
  addDrawActions: typeof Actions.addDrawActions;
}

class CanvasContainer extends Component<CanvasContainerProps> {
  handleNewAction = (action: any) => {
    this.props.addDrawActions([action]);
  }

  render() {
    const { drawActions } = this.props;

    return (
      <Canvas
        drawActions={drawActions}
        onNewAction={this.handleNewAction}
      />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    drawActions: store.drawActions,
  };
}

export default connect(mapStateToProps, {
  addDrawActions: Actions.addDrawActions
})(CanvasContainer);
