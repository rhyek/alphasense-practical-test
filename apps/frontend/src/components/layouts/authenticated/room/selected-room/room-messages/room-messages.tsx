import { ServerToClientEvents } from '@my/shared/dist/event-map';
import React, { memo, useEffect, useState } from 'react';
import { useWebSocket } from '../../../../../contexts/websocket-context';
import { PanelTitle } from '../panel-title';
import { DieRolledMessage } from './die-rolled-message';
import { GameCompletedMessage } from './game-completed-message';
import { GameStartedMessage } from './game-started-message';

export const RoomMessages = memo<{ roomId: number }>(({ roomId }) => {
  const [messages, setMessages] = useState<(string | React.ReactNode)[]>([]);
  const { socket } = useWebSocket();

  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  useEffect(() => {
    const handler: ServerToClientEvents['BET_PLACED'] = ({
      username,
      amount,
    }) => {
      setMessages([
        ...messages,
        <span>
          <strong>{username}</strong> bet {amount}
        </span>,
      ]);
    };
    socket.on('BET_PLACED', handler);
    return () => {
      socket.off('BET_PLACED', handler);
    };
  }, [socket, messages]);

  useEffect(() => {
    const handler: ServerToClientEvents['GAME_STARTED'] = (data) => {
      setMessages([...messages, <GameStartedMessage data={data} />]);
    };
    socket.on('GAME_STARTED', handler);
    return () => {
      socket.off('GAME_STARTED', handler);
    };
  }, [socket, messages]);

  useEffect(() => {
    const handler: ServerToClientEvents['DIE_ROLLED'] = (data) => {
      setMessages([...messages, <DieRolledMessage data={data} />]);
    };
    socket.on('DIE_ROLLED', handler);
    return () => {
      socket.off('DIE_ROLLED', handler);
    };
  }, [socket, messages]);

  useEffect(() => {
    const handler: ServerToClientEvents['GAME_COMPLETE'] = (data) => {
      setMessages([...messages, <GameCompletedMessage data={data} />]);
    };
    socket.on('GAME_COMPLETE', handler);
    return () => {
      socket.off('GAME_COMPLETE', handler);
    };
  }, [socket, messages]);

  return (
    <div
      style={{
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderRight: '1px solid silver',
      }}
    >
      <PanelTitle>messages</PanelTitle>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
});
