import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@my/shared/dist/event-map';
import { injector } from './dependency-injection';
import { SessionService } from './application/session.service';
import { RegisterWsEventHandlers } from './presentation/register-ws-event-handlers';
import { registerHttpEndpoints } from './presentation/register-http-endpoints';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: '*',
  },
});

registerHttpEndpoints(injector, app);

const registerWsSocketHandlers: RegisterWsEventHandlers = injector.get(
  RegisterWsEventHandlers
);
registerWsSocketHandlers.registerDomainEventHandlers(io);

io.use((socket, next) => {
  const sessionService: SessionService = injector.get(SessionService);
  const username = socket.handshake.auth?.username as string | undefined;
  if (username) {
    const session = sessionService.validateSession(username);
    if (session) {
      session.socket = socket;
      socket.data.session = session;
      next();
      return;
    }
  }
  const error = new Error();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error as any).data = {
    type: 'SESSION_NOT_FOUND',
  };
  next(error);
}).on('connection', (socket) => {
  registerWsSocketHandlers.registerSocketEventHandlers(socket);
});

const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
});
