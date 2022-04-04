import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { memo, useEffect, useState } from 'react';
import { useSession } from '../../contexts/session-context';
import { useWebSocket } from '../../contexts/websocket-context';

export const Header = memo(() => {
  const { username, signOut } = useSession();
  const [balance, setBalance] = useState(0);
  const { socket } = useWebSocket();

  useEffect(() => {
    const handler: ServerToClientEvents['BALANCE'] = ({ balance }) => {
      setBalance(balance);
    };
    socket.on('BALANCE', handler);
    return () => {
      socket.off('BALANCE', handler);
    };
  }, [socket]);

  return (
    <div style={{ borderBottom: '1px solid silver', padding: 5 }}>
      <strong>username:</strong> {username}; <strong>balance:</strong> {balance}{' '}
      <button onClick={signOut}>Sign out</button>
    </div>
  );
});
