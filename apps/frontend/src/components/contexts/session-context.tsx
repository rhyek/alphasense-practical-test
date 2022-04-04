import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';

type SessionContextValue = {
  username: string | null;
  signIn: (username: string) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue>(null as any);

export const SessionProvider: React.FC = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  const signIn = useCallback(async (username: string) => {
    await axios.post('http://localhost:8080/sign-in', {
      username,
    });
    setUsername(username);
  }, []);

  const signOut = useCallback(async () => {
    await axios.post('http://localhost:8080/sign-out', { username });
    setUsername(null);
  }, [username]);

  const value = useMemo(
    () => ({
      username,
      signIn,
      signOut,
    }),
    [username, signIn, signOut]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
}
