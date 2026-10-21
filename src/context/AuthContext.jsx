import React, { createContext, useEffect, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tnt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('tnt_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Step 1: password
  // Returns: { requires2FA, preAuthToken } | { requiresSetup, setupToken } | { user }
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    // If already 2FA enabled → need code step
    if (res.data.requires2FA) {
      return { requires2FA: true, preAuthToken: res.data.preAuthToken };
    }

    // If 2FA not enabled yet → need setup step
    if (res.data.requiresSetup) {
      return { requiresSetup: true, setupToken: res.data.setupToken };
    }

    // Legacy path (shouldn't happen now, but safe)
    if (res.data.token) {
      localStorage.setItem('tnt_token', res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    }

    throw new Error('Unexpected login response');
  };

  const completeLogin = (token, user) => {
    localStorage.setItem('tnt_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('tnt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, completeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
