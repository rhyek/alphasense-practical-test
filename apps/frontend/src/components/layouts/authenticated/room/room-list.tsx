import { memo } from 'react';
import { RoomButton } from './button';
import { SectionTitle } from './section-title';

export const RoomList = memo<{
  roomIds: number[];
  currentRoomId: number | null;
  setCurrentRoomId: (id: number) => void;
}>(({ roomIds, currentRoomId, setCurrentRoomId }) => {
  return (
    <div
      style={{
        padding: 10,
        borderRight: '1px solid silver',
      }}
    >
      <SectionTitle>join a room</SectionTitle>
      {roomIds.map((roomId) => (
        <RoomButton
          key={roomId}
          disabled={roomId === currentRoomId}
          onClick={() => setCurrentRoomId(roomId)}
        >
          room #{roomId}
        </RoomButton>
      ))}
    </div>
  );
});
