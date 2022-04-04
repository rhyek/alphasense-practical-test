import { memo, useEffect } from 'react';
import { useWebSocket } from '../../../../contexts/websocket-context';
import { RoomButton } from '../button';
import { PanelTitle } from './panel-title';

export const RoomActions = memo(() => {
  const { socket } = useWebSocket();

  useEffect(() => {
    const handler = () => {
      alert('Error: Insufficient funds.');
    };
    socket.on('INSUFFICIENT_FUNDS', handler);
    return () => {
      socket.off('INSUFFICIENT_FUNDS', handler);
    };
  }, [socket]);

  useEffect(() => {
    const handler = () => {
      alert('Please roll your die again');
    };
    socket.on('REROLL', handler);
    return () => {
      socket.off('REROLL', handler);
    };
  }, [socket]);

  const handleBet = () => {
    const amountStr = prompt('How much?');
    if (amountStr) {
      const amount = Number(amountStr);
      socket.emit('BET', { amount });
    }
  };

  const handleStartGame = () => {
    socket.emit('START');
  };

  const handleRollDie = () => {
    socket.emit('ROLL');
  };

  return (
    <div
      style={{
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <PanelTitle>actions</PanelTitle>
      <div>
        <RoomButton onClick={handleBet}>bet</RoomButton>
        <RoomButton onClick={handleStartGame}>start game</RoomButton>
        <RoomButton onClick={handleRollDie}>roll die</RoomButton>
      </div>
    </div>
  );
});
