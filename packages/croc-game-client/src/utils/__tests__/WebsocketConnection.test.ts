import { WebsocketConnection } from '../WebsocketConnection';
import { Server } from 'mock-socket';

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

describe('WebsocketConnection', () => {
  let connection: WebsocketConnection;
  let url = 'ws://localhost:8000';
  let server: Server;

  beforeEach(() => {
    connection = new WebsocketConnection(url);
    server = new Server(url);
  });

  afterEach(() => {
    server.close();
  });

  test('should open connection and resolve promise', async () => {
    const test = jest.fn();
    const serverConnectionTest = jest.fn();
    server.on('connection', serverConnectionTest);

    await connection.open().then(test);

    expect(test).toBeCalled();
    expect(serverConnectionTest).toBeCalled();
  });

  test('should call close callback when server closes connection', async () => {
    const test = jest.fn();
    connection.closeHandler = test;

    await connection.open();
    server.close();

    expect(test).toBeCalled();
  });

  test('should call close callback when client closes connection', async () => {
    const test = jest.fn();
    connection.closeHandler = test;

    await connection.open();
    connection.close();
    await delay(10);

    expect(test).toBeCalled();
  });

  test('should call close callback when server emits error', async () => {
    const test = jest.fn();
    connection.closeHandler = test;

    await connection.open();
    //@ts-ignore
    server.simulate('error');

    expect(test).toBeCalled();
  });

  test('should call message handler when recieved json message from server', async () => {
    const test = jest.fn();
    const msgData = { tmp: 'hello world' };
    connection.messageHandler = test;

    await connection.open();
    server.emit('message', JSON.stringify(msgData));

    expect(test).toBeCalledWith(msgData);
  });

  test('should send message when connection is opened', async () => {
    const test = jest.fn();
    const msgData = { tmp: 'hello world' };
    server.on('connection', (socket) => {
      //@ts-ignore
      socket.on('message', test);
    });

    await connection.open();
    connection.sendMessage(msgData);
    await delay(10);

    expect(test).toBeCalledWith(JSON.stringify(msgData));
  });

  test('should call close callback when server emits error', async () => {
    const test = jest.fn();
    connection.closeHandler = test;

    const openPromise = connection.open();
    //@ts-ignore
    server.simulate('error');

    await openPromise.catch(test);

    expect(test).toBeCalled();
  });
});