import { memo } from 'react';
import { PanelTitle } from './panel-title';

export const RoomUsers = memo<{ usernames: string[] }>(({ usernames }) => {
  return (
    <div style={{ paddingRight: 10, borderRight: '1px solid silver' }}>
      <PanelTitle>users</PanelTitle>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {usernames.map((username) => (
          <li key={username}>{username}</li>
        ))}
      </ul>
    </div>
  );
});
