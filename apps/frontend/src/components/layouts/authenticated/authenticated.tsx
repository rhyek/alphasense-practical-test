import { memo } from 'react';
import { useHandleWsUserException } from './hooks/use-handle-ws-user-exception';
import { Header } from './header';
import { Rooms } from './room/rooms';

export const AuthenticatedLayout = memo(() => {
  useHandleWsUserException();

  return (
    <>
      <Header />
      <Rooms />
    </>
  );
});
