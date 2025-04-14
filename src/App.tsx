import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  // const [user, setUser] = useState<InstagramUser | null>(null);
  // const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');

    if (accessToken) {
      setToken(accessToken);

      // Save token to cookies with 1 hour expiry
      Cookies.set('insta_token', accessToken, { expires: 1 / 24 });

      // Clean URL
      window.history.replaceState({}, document.title, '/');
    } else {
      const savedToken = Cookies.get('insta_token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  return (
    <div className="container">
      {!token ? (
        <Login />
      ) : (
        <>
          <Profile />
        </>
      )}
    </div>
  );
}

export default App;
