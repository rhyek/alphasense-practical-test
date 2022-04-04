import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { memo } from 'react';

type Props = {
  data: Parameters<ServerToClientEvents['GAME_STARTED']>[0];
};

export const GameStartedMessage = memo<Props>(({ data: { bets, total } }) => {
  return (
    <span>
      <hr />
      <strong style={{ fontSize: '1.5em', color: 'blue' }}>
        GAME STARTED!
      </strong>
      <hr />
      Total bets: {total} credits
      {bets.map((bet) => (
        <div key={bet.username}>
          <strong>{bet.username}: </strong>
          {bet.amount}
        </div>
      ))}
      <hr />
      <span>Start rolling your dice! 🎲</span>
    </span>
  );
});
