import WebSocket from 'ws';

interface ConnectionItem {
  name: string;
  ws: WebSocket;
}

type Comparable = ConnectionItem[keyof ConnectionItem];

function isWebsocket(test: any): test is WebSocket {
  return test.send && test.on && test.once;
}

export class ConnectionsCollection {
  public connections: ConnectionItem[] = [];

  public set(name: string, ws: WebSocket) {
    if (!this.contains(ws)) {
      this.connections.push({ name, ws });
    } else {
      const index = this.findIndex(ws);

      this.connections[index].name = name;
    }
  }

  public delete(matchValue: Comparable) {
    const index = this.findIndex(matchValue);

    if (this.isIndexInvalid(index)) {
      return;
    }

    this.connections.splice(index, 1);
  }

  public contains(matchValue: Comparable) {
    return !this.isIndexInvalid(this.findIndex(matchValue));
  }

  public find(matchValue: Comparable): ConnectionItem | null {
    const index = this.findIndex(matchValue);

    if (this.isIndexInvalid(index)) {
      return null;
    }

    return { ...this.connections[index] };
  }

  public forEach(cb: (item: ConnectionItem) => void) {
    this.connections.forEach(cb);
  }

  public get length() {
    return this.connections.length;
  }

  private isIndexInvalid(index: number) {
    return index < 0 || index === undefined;
  }

  private findIndex(matchValue: Comparable) {
    let index: number;

    if (isWebsocket(matchValue)) {
      index = this.connections.findIndex(
        ({ ws: testWs }) => testWs === matchValue,
      );
    } else {
      index = this.connections.findIndex(
        ({ name: testName }) => testName === matchValue,
      );
    }

    return index;
  }
}
