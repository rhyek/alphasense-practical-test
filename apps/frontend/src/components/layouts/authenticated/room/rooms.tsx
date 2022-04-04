import { memo, useEffect, useState } from 'react';
import { useWebSocket } from '../../../contexts/websocket-context';
import { RoomList } from './room-list';
import { SelectedRoom } from './selected-room/selected-room';

export const Rooms = memo(() => {
  const [roomIds, setRoomIds] = useState<number[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  const { socket } = useWebSocket();

  useEffect(() => {
    socket.emit('LIST_ROOMS', (response) => {
      setRoomIds(response.rooms.map((room) => room.id));
    });
  }, [socket]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
      }}
    >
      <RoomList
        roomIds={roomIds}
        currentRoomId={currentRoomId}
        setCurrentRoomId={setCurrentRoomId}
      />
      <SelectedRoom roomId={currentRoomId} />
    </div>
  );
});
