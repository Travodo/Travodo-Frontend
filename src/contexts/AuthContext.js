import React, { createContext, useEffect, useMemo, useState, useContext } from 'react';
import { getToken, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱 시작 시 AsyncStorage 토큰 기반으로 로그인 상태 복구
  useEffect(() => {
    let mounted = true;

    // API 레이어에서 401 발생 시 전역 로그아웃
    setUnauthorizedHandler(() => {
      if (mounted) setIsLoggedIn(false);
    });

    (async () => {
      try {
        const token = await getToken();
        if (mounted) setIsLoggedIn(!!token);
      } finally {
        if (mounted) setIsBootstrapped(true);
      }
    })();
    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const value = useMemo(
    () => ({ isBootstrapped, isLoggedIn, login, logout }),
    [isBootstrapped, isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
