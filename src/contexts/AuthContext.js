import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { getMyInfo, getToken, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [me, setMe] = useState(null);
  const [isMeLoading, setIsMeLoading] = useState(false);

  // 앱 시작 시 AsyncStorage 토큰 기반으로 로그인 상태 복구
  useEffect(() => {
    let mounted = true;

    // API 레이어에서 401 발생 시 전역 로그아웃
    setUnauthorizedHandler(() => {
      if (mounted) {
        setIsLoggedIn(false);
        setMe(null);
      }
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

  const refreshMe = useCallback(async () => {
    const data = await getMyInfo();
    setMe(data);
    return data;
  }, []);

  // 로그인 상태가 바뀔 때 내정보를 전역 캐싱
  useEffect(() => {
    let mounted = true;

    if (!isLoggedIn) {
      setMe(null);
      setIsMeLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        setIsMeLoading(true);
        const data = await getMyInfo();
        if (mounted) setMe(data);
      } catch (e) {
        // 401은 api interceptor에서 logout 처리됨. 그 외는 me만 비워둠.
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.log('[AuthContext] getMyInfo failed:', e?.response?.status || e?.message);
        }
      } finally {
        if (mounted) setIsMeLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setMe(null);
  };

  const value = useMemo(
    () => ({ isBootstrapped, isLoggedIn, me, isMeLoading, refreshMe, setMe, login, logout }),
    [isBootstrapped, isLoggedIn, me, isMeLoading, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
