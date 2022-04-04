import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { useEffect } from 'react';
import { useWebSocket } from '../../../contexts/websocket-context';

export function useHandleWsUserException() {
  const { socket } = useWebSocket();

  useEffect(() => {
    const handler: ServerToClientEvents['ERROR'] = ({
      errorCode,
      errorMessage,
    }) => {
      let alertMessage = 'Error: ';
      if (errorCode) {
        switch (errorCode) {
          case 'NOT_IN_ROOM':
            alertMessage += 'Not in room';
            break;
          case 'GAME_ONGOING':
            alertMessage += 'Game ongoing';
            break;
          case 'NOT_ENOUGH_BETS':
            alertMessage += 'Not enough betting users';
            break;
          case 'ALREADY_ROLLED':
            alertMessage += 'You already rolled';
            break;
          case 'NOT_PARTICIPATING':
            alertMessage += 'You are not participating in this game';
            break;
        }
      } else if (errorMessage) {
        alertMessage += errorMessage;
      }
      alert(alertMessage);
    };
    socket.on('ERROR', handler);
    return () => {
      socket.off('ERROR', handler);
    };
  }, [socket]);
}
