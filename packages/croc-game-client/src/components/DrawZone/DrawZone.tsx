import React from 'react';
import CanvasContainer from '../../containers/CanvasContainer';
import { CanvasSettings } from '../../types/drawZoneTypes';
import Tools from './Tools';
import './DrawZone.css';

interface DrawZoneProps {
  settings: CanvasSettings,
  onSettingsChange: (newSettings: CanvasSettings) => void;
};

const DrawZone = (props: DrawZoneProps) => (
  <div className="DrawZone">
    <CanvasContainer settings={props.settings} />
    <Tools settings={props.settings} onSettingsChange={props.onSettingsChange} />
  </div>
)

export default DrawZone;
