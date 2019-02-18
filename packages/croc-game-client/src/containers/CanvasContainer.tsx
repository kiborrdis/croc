import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'croc-actions';
import { ActionObject as DrawAction } from 'pixelizer';
import { Store } from '../store';
import DrawZone from '../components/DrawZone';
import { CanvasSettings, CanvasTool } from '../types/drawZoneTypes';

interface CanvasContainerProps {
  drawActions: DrawAction[];
  drawingEnabled: boolean;
  addDrawActions: typeof Actions.addDrawActions;
}

interface CanvasContainerState {
  settings: CanvasSettings;
}

class CanvasContainer extends Component<CanvasContainerProps, CanvasContainerState> {
  public state = {
    settings: {
      tool: CanvasTool.Brush,
      color: '#00ff00',
      lineWidth: 5,
    },
  };

  public handleSettingsChange = (newSettings: CanvasSettings) => {
    this.setState({
      settings: newSettings,
    });
  }

  public handleNewAction = (action: any) => {
    this.props.addDrawActions([action]);
  }

  public render() {
    const { drawActions, drawingEnabled } = this.props;
    const { settings } = this.state;

    return (
      <DrawZone
        drawActions={drawActions}
        settings={settings}
        drawingEnabled={drawingEnabled}
        onNewAction={this.handleNewAction}
        onSettingsChange={this.handleSettingsChange}
      />
    );
  }
}

const mapStateToProps = (store: Store) => {
  return {
    drawActions: store.drawActions,
    drawingEnabled: !!(store.game.leader && store.game.leader === store.user.playerId),
  };
};

export default connect(mapStateToProps, {
  addDrawActions: Actions.addDrawActions,
})(CanvasContainer);
