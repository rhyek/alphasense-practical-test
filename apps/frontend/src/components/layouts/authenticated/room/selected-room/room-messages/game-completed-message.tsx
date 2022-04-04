import { ServerToClientEvents } from '@my/shared/dist/event-map';
import { memo } from 'react';

type Props = {
  data: Parameters<ServerToClientEvents['GAME_COMPLETE']>[0];
};

export const GameCompletedMessage = memo<Props>(
  ({
    data: {
      winner: { username, amount },
    },
  }) => {
    return (
      <>
        <span>
          <div>
            <strong style={{ fontSize: '1.8em', color: 'green' }}>
              {username} WON!!! 🎊🎊🎊
            </strong>
          </div>
          <div>they won {amount} credits!!! 💰💰💰💰</div>
        </span>
        <div>
          <hr />
          game ended
          <hr />
        </div>
      </>
    );
  }
);
