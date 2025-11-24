import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Spinner from '../components/Spinner.jsx';

const AuthContext = createContext({
  user: null,
  token: null,
  status: 'pending',
  error: null
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    status: 'pending',
    error: null
  });

  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const telegramWebApp = window.Telegram?.WebApp;

    if (!telegramWebApp) {
      if (isDev) {
        setState({
          user: { id: 0, first_name: 'Dev', last_name: 'User' },
          token: null,
          status: 'ready',
          error: null
        });
      } else {
        setState({
          user: null,
          token: null,
          status: 'error',
          error: 'Telegram WebApp API недоступен'
        });
      }
      return;
    }

    telegramWebApp.ready();
    telegramWebApp.expand();

    const initData = telegramWebApp.initData;
    if (!initData) {
      if (isDev) {
        setState({
          user: { id: 0, first_name: 'Dev', last_name: 'User' },
          token: null,
          status: 'ready',
          error: null
        });
      } else {
        setState({
          user: null,
          token: null,
          status: 'error',
          error: 'initData отсутствует'
        });
      }
      return;
    }

    const abortController = new AbortController();

    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ initData }),
      signal: abortController.signal
    })
      .then(async (response) => {
        if (!response.ok) {
          const details = await response.json().catch(() => ({}));
          const message = details?.details || 'Не удалось пройти авторизацию';
          throw new Error(message);
        }
        return response.json();
      })
      .then((payload) => {
        setState({
          user: payload.user,
          token: payload.token,
          status: 'ready',
          error: null
        });
      })
      .catch((error) => {
        console.error('[TelegramAuth]', error);
        setState({
          user: null,
          token: null,
          status: 'error',
          error: error.message
        });
      });

    return () => abortController.abort();
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      status: state.status,
      error: state.error
    }),
    [state]
  );

  if (state.status === 'pending') {
    return <Spinner />;
  }

  if (state.status === 'error') {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#fff', background: '#111' }}>
        <p>Ошибка авторизации Telegram:</p>
        <p>{state.error}</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

