import React from 'react';
import CanvasContainer from '..//Canvas';
import { CanvasSettings } from '../../types/drawZoneTypes';
import Tools from './Tools';
import './DrawZone.css';

interface DrawZoneProps {
  settings: CanvasSettings,
  onSettingsChange: (newSettings: CanvasSettings) => void;
  onNewAction: (action: any) => void;
  drawActions: any[];
  drawingEnabled: boolean;
};

const DrawZone = (props: DrawZoneProps) => (
  <div className="DrawZone">
    <CanvasContainer
      drawActions={props.drawActions}
      settings={props.settings}
      drawingEnabled={props.drawingEnabled}
      onNewAction={props.onNewAction} />
    <Tools settings={props.settings} onSettingsChange={props.onSettingsChange} />
  </div>
)

export default DrawZone;
