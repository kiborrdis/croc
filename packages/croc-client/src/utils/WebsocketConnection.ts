function createWs(url: string) {
  return new WebSocket(url);
}

export class WebsocketConnection {
  private ws: WebSocket | null = null;
  private url: string;
  private newMessageCallback: ((msg: any) => void) | null = null;
  private closeCallback: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  public open() {
    this.ws = createWs(this.url);

    this.ws.onmessage = this.handleMessage;
    this.ws.onclose = this.handleClose;
    this.ws.onerror = this.handleError;

    return new Promise((resolve, reject) => {
      if (this.ws !== null) {
        this.ws.onopen = resolve;
      }
    });
  }

  public close() {
    if (!this.ws) {
      throw new Error('WebsocketConnection is not opened');
    }

    this.ws.close();
  }

  public sendMessage = (message: any) => {
    if (!this.ws) {
      throw new Error('WebsocketConnection is not opened');
    }

    this.ws.send(JSON.stringify(message));
  }

  private handleMessage = (event: MessageEvent) => {
    let data = event.data;

    try {
      data = JSON.parse(data);
    } catch (e) {
      return;
    }

    if (this.newMessageCallback) {
      this.newMessageCallback(data);
    }
  }

  private handleClose = (event: CloseEvent) => {
    if (this.closeCallback) {
      this.closeCallback();
    }
  }

  private handleError = (event: Event) => {
    if (this.closeCallback) {
      this.closeCallback();
    }
  }

  public set messageHandler(cb: ((msg: any) => void) | null) {
    this.newMessageCallback = cb;
  }

  public set closeHandler(cb: (() => void) | null) {
    this.closeCallback = cb;
  }
}