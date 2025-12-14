import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://travodo.duckdns.org/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 저장 키
const TOKEN_KEY = '@travodo/token';

// 요청 인터셉터: 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      await removeToken();
    }
    return Promise.reject(error);
  },
);

// 토큰 관리
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('토큰 조회 실패:', error);
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

// 카카오 소셜 로그인
export const loginWithKakao = async (accessToken) => {
  const response = await api.post('/auth/social/login', {
    provider: 'KAKAO',
    accessToken: accessToken,
  });
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

// 내 정보 조회
export const getMyInfo = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// 로그인
export const loginWithEmail = async (data) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

// 회원가입
export const signupWithEmail = async (data) => {
  console.log('=== 회원가입 API 요청 ===');
  console.log('URL:', API_BASE_URL + '/auth/signup');
  console.log('요청 데이터:', JSON.stringify(data, null, 2));

  const response = await api.post('/auth/signup', data);
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

// 이메일 인증번호 전송
export const sendEmailVerification = async (email) => {
  const response = await api.post('/auth/email/verification/send', { email });
  return response.data;
};

// 이메일 인증번호 확인
export const verifyEmailCode = async (email, code) => {
  const response = await api.post('/auth/email/verification/confirm', { email, code });
  return response.data;
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async (nickname) => {
  const response = await api.get('/auth/nickname/check', { params: { nickname } });
  return response.data;
};

// 이메일 찾기
export const findEmail = async (email, code) => {
  const response = await api.post('/auth/email/find', { email, code });
  return response.data;
};

// 비밀번호 재설정
export const resetPassword = async (email, code, newPassword) => {
  const response = await api.post('/auth/password/reset', {
    email,
    code,
    newPassword,
  });
  return response.data;
};

// 비밀번호 변경 (로그인 상태)
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/auth/password/change', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 계정 통합 (이메일 계정에 소셜 로그인 추가)
export const linkSocialAccount = async (email, provider, providerId) => {
  const response = await api.post('/auth/account/link/social', null, {
    params: {
      email,
      provider,
      providerId,
    },
  });
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

// 회원탈퇴
export const deleteAccount = async () => {
  const response = await api.delete('/auth/account');
  await removeToken();
  return response.data;
};

export default api;
