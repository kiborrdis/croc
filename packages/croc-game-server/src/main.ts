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
  AnyMessage,
} from 'croc-messages';
import { ConnectionsCollection } from './ConnectionsCollection';
import { WebsocketResponder } from './WebsocketResponder';
import { CrocGame } from './CrocGame';
import { CrocGameData } from './CrocGameData';
import dictionary from './rusDictionary';
import winston from 'winston';
import yargs from 'yargs';

const timePerRound = parseInt(yargs.argv.TR as string, 10) || 120;
const port = parseInt(yargs.argv.P as string, 10) || 8000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),

  }));
}

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
    timeForRound: timePerRound * 1000,
  },
});

wsApp.app.ws('/ws', (ws, request) => {
  console.log('open');
  ws.on('message', (msg) => {
    let jsonMessage: any;
    console.log('message');
    try {
      jsonMessage = JSON.parse(msg.toString());
    } catch (e) {
      logger.log('error', 'Error parsing json from message', msg);

      return;
    }

    handleMessage(jsonMessage, ws);

    responder.sendAllEnqueuedMessages();
  });

  ws.on('close', () => {
    const connection = connections.find(ws);

    if (connection) {
      logger.log('info', `Player '${connection.name}' disconnected`);

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
    if (Array.isArray(message.action.payload)) {
      logger.log(
        'info',
        `Recieved '${message.action.type}' message from ${connection.name}`,
        message.action.payload.length,
      );
    } else {
      logger.log(
        'info',
        `Recieved '${message.action.type}' message from ${connection.name}`,
        message.action.payload,
      );
    }

    handleGameMessage(connection.name, message);
  }
}

function handleIntroductionMessage(message: IntroductionMessage, ws: WebSocket) {
  if (connections.contains(ws)) {
    logger.log('info', `Trying to reconnect '${message.playerId}'`);

    const recievedId = game.connectPlayerWithInfo({
      id: message.playerId,
      name: message.name,
    });

    logger.log('info', `Player '${message.name}' with id '${message.playerId}' reconnected`);

    connections.set(recievedId, ws);
  } else {
    const playerId = game.connectPlayerWithInfo({
      name: message.name,
    });

    logger.log('info', `Player '${message.name}' with id '${playerId}' connected`);

    connections.set(playerId, ws);
    responder.enqueueResponseForOne(playerId, [buildIntroductionMessage(message.name, playerId)]);
  }
}

function handleGameMessage(id: string, message: AnyMessage) {
  try {
    game.handleMessage(id, message);
  } catch (e) {
    logger.log('error', e);
  }
}

app.listen(port, () => logger.log('info', `Server listening on port ${port}!`));
