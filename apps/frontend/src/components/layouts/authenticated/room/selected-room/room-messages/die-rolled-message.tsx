import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { memo } from 'react';

type Props = {
  data: Parameters<ServerToClientEvents['DIE_ROLLED']>[0];
};

export const DieRolledMessage = memo<Props>(({ data: { username, value } }) => {
  return (
    <span>
      <strong>{username}</strong> rolled{' '}
      <strong style={{ color: 'red', fontSize: '1.5em' }}>{value}</strong>
    </span>
  );
});
