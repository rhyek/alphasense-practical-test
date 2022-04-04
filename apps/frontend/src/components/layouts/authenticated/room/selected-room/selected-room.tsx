import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { memo, useEffect, useState } from 'react';
import { useWebSocket } from '../../../../contexts/websocket-context';
import { RoomActions } from './room-actions';
import { RoomMessages } from './room-messages/room-messages';
import { RoomUsers } from './room-users';
import { SectionTitle } from '../section-title';

export const SelectedRoom = memo<{ roomId: number | null }>(({ roomId }) => {
  const [roomData, setRoomData] = useState<{
    roomId: number;
    usernames: string[];
  } | null>(null);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (roomId) {
      socket.emit('JOIN_ROOM', roomId);
      const handler: ServerToClientEvents['ROOM_STATUS'] = ({ users }) => {
        setRoomData({ roomId, usernames: users.map((user) => user.username) });
      };
      socket.on('ROOM_STATUS', handler);
      return () => {
        socket.off('ROOM_STATUS', handler);
      };
    }
  }, [socket, roomId]);

  if (roomData === null) {
    return <div>Not in room...</div>;
  }

  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 10 }}
    >
      <SectionTitle>current room: {roomId}</SectionTitle>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <RoomUsers usernames={roomData.usernames} />
        <RoomMessages roomId={roomData.roomId} />
        <RoomActions />
      </div>
    </div>
  );
});
