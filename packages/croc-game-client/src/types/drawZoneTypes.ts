export enum CanvasTool {
  Brush = 'Brush',
  Line = 'Line',
  Rectangle = 'Rectangle',
  Polyline = 'Polyline',
  Circle = 'Circle',
}

export interface CanvasSettings {
  tool: CanvasTool;
  color: string;
  lineWidth: number;
}
