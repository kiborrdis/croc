import React, { Component } from 'react';
import DrawZone from '../components/DrawZone';
import { CanvasSettings, CanvasTool } from '../types/drawZoneTypes';

interface DrawZoneContainerProps {}

interface DrawZoneContainerState {
  settings: CanvasSettings,
}

class DrawZoneContainer extends Component<DrawZoneContainerProps, DrawZoneContainerState> {
  state = {
    settings: {
      tool: CanvasTool.Brush,
      color: '#00ff00',
      lineWidth: 5,
    },
  }

  handleSettingsChange = (newSettings: CanvasSettings) => {
    this.setState({
      settings: newSettings,
    });
  }

  render() {
    return (
      <DrawZone settings={this.state.settings} onSettingsChange={this.handleSettingsChange} />
    );
  }
}

export default DrawZoneContainer;
