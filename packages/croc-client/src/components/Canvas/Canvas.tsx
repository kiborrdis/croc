import React, { Component, RefObject } from 'react';
import { Pixelizer, BrowserInteractionAdapter, RectangleTool, TwoPointRecorder, ActionSerializer,  ActionObject as DrawAction } from 'pixelizer';
import './Canvas.css';

interface CanvasProps {
  onNewAction: (action: any) => void;
  drawActions: DrawAction[];
}

class Canvas extends Component<CanvasProps> {
  rootRef: RefObject<HTMLDivElement>  = React.createRef();
  pixelizer: Pixelizer | null = null;
  lastAppliedActionIndex = 0;

  componentDidMount() {
    const adapter = new BrowserInteractionAdapter();
    this.pixelizer = new Pixelizer(adapter);

    this.pixelizer.mountCanvasInDOMElement(this.rootRef.current as HTMLElement);
    this.pixelizer.setConfig({
      recorderCreator: (...args) => new TwoPointRecorder(...args),
      tool: new RectangleTool(),
    })
    this.pixelizer.setStyle({
      color: '#ff0000',
      lineWidth: 5,
    });
    this.pixelizer.addNewActionListener(this.handleNewAction);

    this.applyNotAppliedActions();
  }

  componentDidUpdate() {
    this.applyNotAppliedActions();
  }

  applyNotAppliedActions() {
    const { drawActions } = this.props;

    if (this.lastAppliedActionIndex > drawActions.length) {
      return;
    }

    if (this.pixelizer) {
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