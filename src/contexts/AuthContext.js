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
        console.log('[AuthContext] Unauthorized handler - 로그아웃');
        setIsLoggedIn(false);
        setMe(null);
      }
    });

    (async () => {
      try {
        const token = await getToken();
        console.log('[AuthContext] 저장된 토큰:', token ? '있음' : '없음');

        if (token && mounted) {
          // 토큰이 있으면 로그인 상태로 설정
          setIsLoggedIn(true);

          // 토큰 유효성 검증 (getMyInfo 호출로 자동 검증됨)
          console.log('[AuthContext] 토큰 유효성 검증 중...');
        }
      } catch (error) {
        console.error('[AuthContext] 토큰 확인 실패:', error);
      } finally {
        if (mounted) setIsBootstrapped(true);
      }
    })();

    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
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
        console.log('[AuthContext] 사용자 정보 조회 시작...');
        const data = await getMyInfo();
        console.log('[AuthContext] 사용자 정보 조회 성공:', data?.nickname || data?.email);
        if (mounted) setMe(data);
      } catch (e) {
        console.error('[AuthContext] getMyInfo 실패:', {
          status: e?.response?.status,
          message: e?.response?.data?.message || e?.message,
          data: e?.response?.data,
        });

        // 500 에러인 경우 로그아웃하지 않고 재시도 가능하도록
        if (e?.response?.status === 500) {
          console.log('[AuthContext] 서버 에러 - 로그인 상태 유지');
          // 토큰은 유지하되 me는 null
        }
      } finally {
        if (mounted) setIsMeLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

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
