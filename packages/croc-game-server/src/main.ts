import express from 'express';
import expressWs from 'express-ws';
import WebSocket from 'ws';
import { setAfterCallHandler } from './utils/DelayCall';
import {
  buildIntroductionMessage,
  isActionMessage,
  isIntroductionMessage,
  IntroductionMessage,
  ActionMessage,
} from 'croc-messages';
import { ConnectionsCollection } from './ConnectionsCollection';
import { WebsocketResponder } from './WebsocketResponder';
import { CrocGame } from './CrocGame';
import { CrocGameData } from './CrocGameData';
import dictionary from './rusDictionary';

const app = express();
const wsApp = expressWs(app);

const connections = new ConnectionsCollection();
const responder = new WebsocketResponder(connections);

setAfterCallHandler(() => {
  responder.sendAllEnqueuedMessages();
});

function pickRandomValueFrom<V>(array: V[]): V {
  return array[Math.floor(Math.random() * array.length)];
}

const game = new CrocGame({
  responder,
  gameDataInitializer: () => new CrocGameData(),
  config: {
    pickLeaderStrategy: (ids) => pickRandomValueFrom(ids),
    pickWord: () => pickRandomValueFrom(dictionary),
    reconnectionTimeout: 20000,
    timeForRound: 10 * 1000,
  },
});

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

    responder.sendAllEnqueuedMessages();
  });

  ws.on('close', () => {
    const connection = connections.find(ws);

    if (connection) {
      game.disconnectPlayerWithId(connection.name);
    }

    connections.delete(ws);

    responder.sendAllEnqueuedMessages();
  });
});

function handleMessage(message: { type: string, [name: string]: any}, ws: WebSocket) {
  if (isIntroductionMessage(message)) {
    handleIntroductionMessage(message, ws);
  } else if (!connections.contains(ws)) {
    return;
  }

  if (isActionMessage(message)) {
    handleActionMessage(message, ws);
  }
}

function handleActionMessage(message: ActionMessage, ws: WebSocket) {
  const connection = connections.find(ws);

  if (connection) {
    game.handleMessage(connection.name, message);
  }
}

function handleIntroductionMessage(message: IntroductionMessage, ws: WebSocket) {
  if (connections.contains(ws)) {
    const connection = connections.find(ws);

    if (connection) {
      const recievedId = game.connectPlayerWithInfo({
        id: connection.name,
        name: message.name,
      });
      connections.set(recievedId, ws);
    }
  } else {
    const playerId = game.connectPlayerWithInfo({
      name: message.name,
    });

    connections.set(playerId, ws);

    responder.enqueueResponseForOne(playerId, [buildIntroductionMessage(message.name, playerId)]);
  }
}

app.listen(8000, () => console.log(`Server listening on port ${8000}!`));
