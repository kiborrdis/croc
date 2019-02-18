import React, { PureComponent } from 'react';
import { CanvasTool, CanvasSettings } from '../../types/drawZoneTypes';
import { HuePicker, ColorResult } from 'react-color';
import ToolButton from './ToolButton';
import './Tools.css';

interface ToolsProps {
  settings: CanvasSettings;
  onSettingsChange: (newSettings: CanvasSettings) => void;
}

class Tools extends PureComponent<ToolsProps> {
  public handleToolChange = (newTool: CanvasTool) => {
    this.props.onSettingsChange({
      ...this.props.settings,
      tool: newTool,
    });
  }

  public handleWidthChange = (newWidth: number) => {
    this.props.onSettingsChange({
      ...this.props.settings,
      lineWidth: newWidth,
    });
  }

  public handleColorChange = (newColor: ColorResult) => {
    this.props.onSettingsChange({
      ...this.props.settings,
      color: newColor.hex,
    });
  }

  public render() {
    const { settings: { color } } = this.props;

    return (
      <div className='Tools'>
        <ToolButton label='Brush' value={CanvasTool.Brush} onClick={this.handleToolChange} />
        <ToolButton label='Line' value={CanvasTool.Line} onClick={this.handleToolChange} />
        <ToolButton label='Circle' value={CanvasTool.Circle} onClick={this.handleToolChange} />
        <ToolButton label='Rectangle' value={CanvasTool.Rectangle} onClick={this.handleToolChange} />
        <ToolButton label='Polyline' value={CanvasTool.Polyline} onClick={this.handleToolChange} />

        <ToolButton label='2' value={5} onClick={this.handleWidthChange} />
        <ToolButton label='5' value={5} onClick={this.handleWidthChange} />
        <ToolButton label='10' value={10} onClick={this.handleWidthChange} />
        <ToolButton label='15' value={15} onClick={this.handleWidthChange} />
        <div>
          <HuePicker
            color={color}
            onChangeComplete={this.handleColorChange}
          />
        </div>
      </div>
    );
  }
}

export default Tools;
