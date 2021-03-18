import { Message } from 'croc-messages';
import WebSocket from 'ws';
import { ConnectionsCollection } from './ConnectionsCollection';
import { Responder } from './interfaces/Responder';

interface Response {
  to: {
    recipients: string[] | 'all';
    except?: string[];
  };
  messages: Message[];
}

export class WebsocketResponder implements Responder {
  private responseQueue: Response[] = [];
  private connections: ConnectionsCollection;

  constructor(connections: ConnectionsCollection) {
    this.connections = connections;
  }

  public enqueueResponseForAll(messages: Message[]): void {
    this.responseQueue.push({
      to: { recipients: 'all' },
      messages,
    });
  }

  public enqueueResponseForAllButOne(id: string, messages: Message[]): void {
    this.responseQueue.push({
      to: { recipients: 'all', except: [id] },
      messages,
    });
  }

  public enqueueResponseForOne(id: string, messages: Message[]): void {
    this.responseQueue.push({
      to: { recipients: [id] },
      messages,
    });
  }

  public sendAllEnqueuedMessages(): void {
    this.responseQueue.forEach(({ to, messages }) => {
      messages.forEach((message) => {
        if (to.recipients === 'all') {
          if (to.except && to.except.length > 0) {
            this.sendToAllButOne(to.except[0], message);
          } else {
            this.sendToAll(message);
          }
        } else if (to.recipients.length === 1) {
          this.sendTo(to.recipients[0], message);
        }
      });
    });

    this.responseQueue = [];
  }

  private sendToAllButOne(id: string, message: Message) {
    this.connections.forEach(({ ws, name }) => {
      if (ws.readyState === ws.OPEN && name !== id) {
        this.send(ws, message);
      }
    });
  }

  private sendToAll(message: Message) {
    this.connections.forEach(({ ws }) => {
      if (ws.readyState === ws.OPEN) {
        this.send(ws, message);
      }
    });
  }

  private sendTo(id: string, message: Message) {
    const connection = this.connections.find(id);

    if (connection) {
      this.send(connection.ws, message);
    }
  }

  public send(ws: WebSocket, message: Message): void {
    ws.send(JSON.stringify(message));
  }
}
