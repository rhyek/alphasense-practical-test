import { SessionProvider } from './components/contexts/session-context';
import { Main } from './components/main';

function App() {
  return (
    <SessionProvider>
      <Main />
    </SessionProvider>
  );
}

export default App;
