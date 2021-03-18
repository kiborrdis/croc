import WebSocket from 'ws';

interface ConnectionItem {
  name: string;
  ws: WebSocket;
}

type Comparable = ConnectionItem[keyof ConnectionItem];

function isWebsocket(test: unknown): test is WebSocket {
  if (typeof test === 'object' && test) {
    return 'send' in test && 'on' in test && 'once' in test;
  }

  return false;
}

export class ConnectionsCollection {
  public connections: ConnectionItem[] = [];

  public set(name: string, ws: WebSocket): void {
    if (!this.contains(ws)) {
      this.connections.push({ name, ws });
    } else {
      const index = this.findIndex(ws);

      this.connections[index].name = name;
    }
  }

  public delete(matchValue: Comparable): void {
    const index = this.findIndex(matchValue);

    if (this.isIndexInvalid(index)) {
      return;
    }

    this.connections.splice(index, 1);
  }

  public contains(matchValue: Comparable): boolean {
    return !this.isIndexInvalid(this.findIndex(matchValue));
  }

  public find(matchValue: Comparable): ConnectionItem | null {
    const index = this.findIndex(matchValue);

    if (this.isIndexInvalid(index)) {
      return null;
    }

    return { ...this.connections[index] };
  }

  public forEach(cb: (item: ConnectionItem) => void): void {
    this.connections.forEach(cb);
  }

  public get length(): number {
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
