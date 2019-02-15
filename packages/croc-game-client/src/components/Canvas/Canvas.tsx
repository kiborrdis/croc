import React, { Component, RefObject } from 'react';
import {
  Pixelizer,
  BrowserInteractionAdapter,
  RectangleTool,
  MultilineTool,
  NPointRecorder,
  TwoPointRecorder,
  ActionSerializer,
  ActionObject as DrawAction,
  PixelizerConfig,
  LineTool,

} from 'pixelizer';
import { CanvasSettings, CanvasTool } from '../../types/drawZoneTypes';
import './Canvas.css';

interface CanvasProps {
  onNewAction: (action: any) => void;
  drawActions: DrawAction[];
  drawingEnabled: boolean;
  settings: CanvasSettings;
}

const canvasToolToPixelizerConfig: { [tool in CanvasTool]: PixelizerConfig } = {
  [CanvasTool.Brush]: {
    tool: new MultilineTool(),
    recorderCreator: (...args) => new NPointRecorder(...args),
  },
  [CanvasTool.Circle]: {
    tool: new RectangleTool(),
    recorderCreator: (...args) => new TwoPointRecorder(...args),
  },
  [CanvasTool.Rectangle]: {
    tool: new RectangleTool(),
    recorderCreator: (...args) => new TwoPointRecorder(...args),
  },
  [CanvasTool.Polyline]: {
    tool: new MultilineTool(),
    recorderCreator: (...args) => new NPointRecorder(...args),
  },
  [CanvasTool.Line]: {
    tool: new LineTool(),
    recorderCreator: (...args) => new TwoPointRecorder(...args)
  }
};


class Canvas extends Component<CanvasProps> {
  rootRef: RefObject<HTMLDivElement>  = React.createRef();
  pixelizer: Pixelizer | null = null;
  lastAppliedActionIndex = 0;

  componentDidMount() {
    const adapter = new BrowserInteractionAdapter();
    this.pixelizer = new Pixelizer(adapter);

    this.pixelizer.mountCanvasInDOMElement(this.rootRef.current as HTMLElement);
    this.pixelizer.addNewActionListener(this.handleNewAction);
    this.applyNotAppliedActions();
    this.useSettings();
  }

  componentDidUpdate() {
    this.applyNotAppliedActions();
    this.useSettings();
  }

  useSettings() {
    const { settings: { tool, ...restSettings }, drawingEnabled } = this.props;

    if (this.pixelizer) {
      this.pixelizer.setConfig(canvasToolToPixelizerConfig[tool]);

      this.pixelizer.setStyle({ ...restSettings });

      this.pixelizer.enableInteractions(drawingEnabled);
    }
  }

  applyNotAppliedActions() {
    const { drawActions } = this.props;

    if (!this.pixelizer) {
      return;
    }

    if (this.lastAppliedActionIndex > drawActions.length) {
      if (drawActions.length === 0 && this.lastAppliedActionIndex > 0) {
        this.pixelizer.clear();

        this.lastAppliedActionIndex = 0;
      }

      return;
    }

    if (drawActions.length > 0) {
      this.pixelizer.applyActions(
        drawActions.slice(this.lastAppliedActionIndex, drawActions.length).map(rawAction => ActionSerializer.deserializeFromObj(rawAction))
      )

      this.lastAppliedActionIndex = drawActions.length - 1;
    }
  }

  handleNewAction = (action: any) => {
    this.props.onNewAction(ActionSerializer.serialize(action));
  }

  render() {
    return (
      <div ref={this.rootRef} className="Canvas">
      </div>
    );
  }
}

export default Canvas;