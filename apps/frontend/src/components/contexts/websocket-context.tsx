import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@my/shared/dist/event-map';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Loading } from '../loading';
import { useSession } from './session-context';

type WebSocketContextValue = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

const WebSocketContext = React.createContext<WebSocketContextValue>(
  null as any
);

export const WebSocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [connected, setConnected] = useState(false);

  const { username, signOut } = useSession();

  useEffect(() => {
    if (username) {
      const socket = io(`http://${window.location.hostname}:8080`, {
        auth: {
          username,
        },
      });
      socket.on('connect', () => {
        setConnected(socket.connected);
      });
      socket.on('connect_error', (error) => {
        if ((error as any).data?.type === 'SESSION_NOT_FOUND') {
          signOut();
        } else {
          console.log(error);
        }
      });
      setSocket(socket);
      return () => {
        socket.close();
      };
    }
  }, [username, signOut]);

  const value: WebSocketContextValue = useMemo(
    () => ({
      socket: socket!,
    }),
    [socket]
  );

  if (!connected) {
    return <Loading />;
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWebSocket() {
  return useContext(WebSocketContext);
}
