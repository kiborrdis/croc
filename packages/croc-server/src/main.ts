import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import { Actions } from 'croc-actions';
import {
  buildActionMessage, isActionMessage, isIntroductionMessage, ActionMessage, IntroductionMessage,
} from 'croc-messages';
import { ConnectionsCollection } from './ConnectionsCollection';

const app = express();
const wsApp = expressWs(app);

class Responder {
  private connections: ConnectionsCollection;

  constructor(responderConnections: ConnectionsCollection) {
    this.connections = connections;
  }

  public broadcastMessage(message: ActionMessage | IntroductionMessage, except: WebSocket[] = []) {
    this.connections.forEach((connection) => {
      if (except.indexOf(connection.ws) === -1) {
        this.sendMessage(connection.ws, message);
      }
    });
  }

  public sendMessage(ws: WebSocket, message: ActionMessage | IntroductionMessage) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

const connections = new ConnectionsCollection();
const responder = new Responder(connections);

wsApp.app.ws('/ws', (ws, request) => {
  ws.on('message', (msg) => {
    let jsonMessage: any;

    try {
      jsonMessage = JSON.parse(msg.toString());
    } catch (e) {
      console.log('Error parsing json from message', msg);

      return;
    }

    handleMessage(jsonMessage, ws);
  });

  ws.on('close', () => {
    const connection = connections.find(ws);

    connections.delete(ws);

    responder.broadcastMessage(buildActionMessage(
      Actions.addChatMessages([{ text: `'${connection.name}' disconnected` }]),
      'server',
    ));
  });
});

function handleMessage(message: { type: string, [name: string]: any}, ws: WebSocket) {
  if (isActionMessage(message)) {
    handleActionMessage(message, ws);
  } else if (isIntroductionMessage(message)) {
    handleIntroductionMessage(message, ws);
  }
}

function handleActionMessage(message: ActionMessage, ws: WebSocket) {
  const connection = connections.find(ws);

  responder.broadcastMessage(buildActionMessage(message.action, connection.name), [ ws ]);
}

function handleIntroductionMessage(message: IntroductionMessage, ws: WebSocket) {
  if (connections.contains(ws)) {
    const connection = connections.find(ws);

    connections.set(message.name, ws);

    responder.broadcastMessage(buildActionMessage(
      Actions.addChatMessages([{ text: `Rename '${connection.name}' to '${message.name}'` }]),
      'server',
    ));
  } else {
    connections.set(message.name, ws);

    responder.broadcastMessage(buildActionMessage(
      Actions.addChatMessages([{ text: `New connection with name '${message.name}'` }]),
      'server',
    ));
  }
}

app.listen(8000, () => console.log(`Server listening on port ${8000}!`))
