import React from 'react';
import CanvasContainer from '../../containers/CanvasContainer';
import { CanvasSettings, CanvasTool } from '../../types/drawZoneTypes';
import './DrawZone.css';

interface DrawZoneProps {
  settings: CanvasSettings,
};

const DrawZone = (props: DrawZoneProps) => (
  <div className="DrawZone">
    <CanvasContainer settings={props.settings} />
    <div className="Tools" />
  </div>
)

export default DrawZone;
