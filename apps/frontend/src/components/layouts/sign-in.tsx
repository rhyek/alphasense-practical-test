import { FormEventHandler, memo, useState } from 'react';
import { useSession } from '../contexts/session-context';

export const SignIn = memo(() => {
  const { signIn } = useSession();
  const [username, setUsername] = useState(
    sessionStorage.getItem('_as_username') ?? '' // to help during dev
  );

  const submitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    await signIn(username);
    sessionStorage.setItem('_as_username', username);
  };

  return (
    <div>
      <div>sign in</div>
      <form onSubmit={submitHandler}>
        <label>
          username:
          <input
            required={true}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type='submit'>Sign in</button>
      </form>
    </div>
  );
});
