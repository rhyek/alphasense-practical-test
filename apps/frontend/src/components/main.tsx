import { memo } from 'react';
import { useSession } from './contexts/session-context';
import { WebSocketProvider } from './contexts/websocket-context';
import { AuthenticatedLayout } from './layouts/authenticated/authenticated';
import { SignIn } from './layouts/sign-in';

export const Main = memo(() => {
  const { username } = useSession();

  if (!username) {
    return <SignIn />;
  }

  return (
    <WebSocketProvider>
      <AuthenticatedLayout />
    </WebSocketProvider>
  );
});
