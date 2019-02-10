import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { ActionObject as DrawAction } from 'pixelizer';
import { Store } from '../store';
import Canvas from '../components/Canvas';
import { CanvasSettings } from '../types/drawZoneTypes';

interface CanvasContainerProps {
  settings: CanvasSettings,
  drawActions: DrawAction[];
  addDrawActions: typeof Actions.addDrawActions;
}

class CanvasContainer extends Component<CanvasContainerProps> {
  handleNewAction = (action: any) => {
    this.props.addDrawActions([action]);
  }

  render() {
    const { drawActions, settings } = this.props;

    return (
      <Canvas
        drawActions={drawActions}
        settings={settings}
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
