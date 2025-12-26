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

// 401 발생 시 전역 로그아웃 처리를 위해 핸들러를 주입할 수 있게 함
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

// 토큰 저장 키
const TOKEN_KEY = '@travodo/token';

// 요청 인터셉터: 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      // 개발용 디버그: 인증 헤더가 실제로 붙는지 확인
      const hasAuth = !!config.headers?.Authorization;
      // eslint-disable-next-line no-console
      console.log(`[api] ${config.method?.toUpperCase()} ${config.url} auth=${hasAuth}`);
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
      if (typeof unauthorizedHandler === 'function') {
        try {
          unauthorizedHandler();
        } catch (_) {
          // noop
        }
      }
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

// -----------------------------
// Helpers
// -----------------------------
const guessMimeType = (uri) => {
  const lower = (uri || '').toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'application/octet-stream';
};

const guessFileName = (uri) => {
  if (!uri) return `file-${Date.now()}`;
  const parts = uri.split('/');
  const last = parts[parts.length - 1];
  return last || `file-${Date.now()}`;
};

const uriToFormFile = (uri) => ({
  uri,
  name: guessFileName(uri),
  type: guessMimeType(uri),
});

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

// 로그아웃
export const logout = async () => {
  const response = await api.post('/auth/logout');
  await removeToken();
  return response.data;
};

// -----------------------------
// Users (내 정보)
// -----------------------------
export const updateMyProfile = async (data) => {
  // data: { nickname?, name?, birthDate?, gender?, phoneNumber? }
  const response = await api.put('/users/me', data);
  return response.data;
};

export const uploadMyProfileImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', uriToFormFile(imageUri));
  const response = await api.post('/users/me/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteMyProfileImage = async () => {
  const response = await api.delete('/users/me/profile-image');
  return response.data;
};

export const getMyPosts = async ({ page = 0, size = 20 } = {}) => {
  const response = await api.get('/users/me/posts', { params: { page, size } });
  return response.data;
};

// -----------------------------
// Trips
// -----------------------------
export const createTrip = async (data) => {
  // data: { name, place, startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', maxMembers }
  const response = await api.post('/trips', data);
  return response.data;
};

export const deleteTrip = async (tripId) => {
  const response = await api.delete(`/trips/${tripId}`);
  return response.data;
};

export const joinTripByInviteCode = async (inviteCode) => {
  const response = await api.post('/trips/join', { inviteCode });
  return response.data;
};

export const getTripInviteCode = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/invite-code`);
  return response.data;
};

export const regenerateInviteCode = async (tripId) => {
  const response = await api.post(`/trips/${tripId}/invite-code`);
  return response.data;
};

export const updateTripStatus = async (tripId, status) => {
  // status: UPCOMING | ONGOING | FINISHED
  const response = await api.patch(`/trips/${tripId}/status`, { status });
  return response.data;
};

export const getUpcomingTrips = async () => {
  const response = await api.get('/trips/upcoming');
  return response.data;
};

export const getCurrentTrip = async () => {
  const response = await api.get('/trips/current');
  return response.data;
};
export const getTripsByMonth = async (year, month) => {
  const response = await api.get('/trips/calendar', { params: { year, month } });
  return response.data;
};

export const getPastTrips = async () => {
  const response = await api.get('/trips/me/trips', { params: { status: 'PAST' } });
  return response.data;
};

export const getTripMembers = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/members`);
  return response.data;
};

// 공동 준비물 (shared-items)
export const getSharedItems = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/shared-items`);
  return response.data;
};

export const createSharedItem = async (tripId, { name }) => {
  const response = await api.post(`/trips/${tripId}/shared-items`, { name });
  return response.data;
};

export const updateSharedItem = async (tripId, itemId, { name, checked }) => {
  const response = await api.patch(`/trips/${tripId}/shared-items/${itemId}`, { name, checked });
  return response.data;
};

export const assignSharedItem = async (tripId, itemId) => {
  const response = await api.patch(`/trips/${tripId}/shared-items/${itemId}/assign`);
  return response.data;
};

export const unassignSharedItem = async (tripId, itemId) => {
  const response = await api.patch(`/trips/${tripId}/shared-items/${itemId}/unassign`);
  return response.data;
};

export const deleteSharedItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/shared-items/${itemId}`);
  return response.data;
};

// 위치 업데이트 / 동행자 위치 / POI
export const updateMyLocation = async (tripId, { latitude, longitude }) => {
  const response = await api.post(`/trips/${tripId}/location`, { latitude, longitude });
  return response.data;
};

export const getMemberLocations = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/members/locations`);
  return response.data;
};

export const getMapPoints = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/map-points`);
  return response.data;
};

// -----------------------------
// Community
// -----------------------------
export const getCommunityPosts = async ({ tag, sort = 'recent', page = 0, size = 20 } = {}) => {
  const params = { sort, page, size };
  if (tag) params.tag = tag; // TravelTag: SOLO | FRIEND | COUPLE | FAMILY | RELAXATION
  const response = await api.get('/community/posts', { params });
  return response.data;
};

export const getCommunityPost = async (postId) => {
  const response = await api.get(`/community/posts/${postId}`);
  return response.data;
};

export const createCommunityPost = async ({
  title,
  content,
  tags = [],
  tripId,
  imageUris = [],
  imageUrls = [],
  thumbnailUrl,
}) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  (tags || []).forEach((t) => formData.append('tags', t));
  if (tripId != null) formData.append('tripId', String(tripId));
  if (thumbnailUrl) formData.append('thumbnailUrl', thumbnailUrl);
  (imageUrls || []).forEach((u) => formData.append('imageUrls', u));
  (imageUris || []).forEach((uri) => formData.append('images', uriToFormFile(uri)));

  const response = await api.post('/community/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCommunityPost = async (
  postId,
  { title, content, tags = [], tripId, imageUris = [], imageUrls = [], thumbnailUrl },
) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  (tags || []).forEach((t) => formData.append('tags', t));
  if (tripId != null) formData.append('tripId', String(tripId));
  if (thumbnailUrl) formData.append('thumbnailUrl', thumbnailUrl);
  (imageUrls || []).forEach((u) => formData.append('imageUrls', u));
  (imageUris || []).forEach((uri) => formData.append('images', uriToFormFile(uri)));

  const response = await api.put(`/community/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCommunityPost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}`);
  return response.data;
};

export const likeCommunityPost = async (postId) => {
  const response = await api.post(`/community/posts/${postId}/likes`);
  return response.data;
};

export const unlikeCommunityPost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}/likes`);
  return response.data;
};

export const bookmarkCommunityPost = async (postId) => {
  const response = await api.post(`/community/posts/${postId}/bookmarks`);
  return response.data;
};

export const unbookmarkCommunityPost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}/bookmarks`);
  return response.data;
};

export const getBookmarkedPosts = async ({ page = 0, size = 20 } = {}) => {
  const response = await api.get('/community/bookmarks', { params: { page, size } });
  return response.data;
};

export const getPostComments = async (postId, { page = 0, size = 20 } = {}) => {
  const response = await api.get(`/community/posts/${postId}/comments`, { params: { page, size } });
  return response.data;
};

export const createPostComment = async (postId, { content }) => {
  const response = await api.post(`/community/posts/${postId}/comments`, { content });
  return response.data;
};

export const updateComment = async (commentId, { content }) => {
  const response = await api.put(`/community/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/community/comments/${commentId}`);
  return response.data;
};

export const reportPost = async (postId, data) => {
  // data: PostReportRequest (Swagger 스키마에 맞춰 전달)
  const response = await api.post(`/community/posts/${postId}/reports`, data);
  return response.data;
};

export const likeComment = async (commentId) => {
  const response = await api.post(`/community/comments/${commentId}/likes`);
  return response.data;
};

export const unlikeComment = async (commentId) => {
  const response = await api.delete(`/community/comments/${commentId}/likes`);
  return response.data;
};

// -----------------------------
// Upload (S3)
// -----------------------------
export const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', uriToFormFile(imageUri));
  const response = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadImages = async (imageUris = []) => {
  const formData = new FormData();
  (imageUris || []).forEach((uri) => formData.append('files', uriToFormFile(uri)));
  const response = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 요청 인터셉터: 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      const hasAuth = !!config.headers?.Authorization;
      console.log(`[api] ${config.method?.toUpperCase()} ${config.url} auth=${hasAuth}`);
      // 토큰의 앞부분만 로깅 (보안)
      if (token) {
        console.log(`[api] Token: ${token}...`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 에러 처리 강화
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(
        `[api] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
      );
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.log('=== API 에러 상세 ===');
      console.log('URL:', error.config?.url);
      console.log('Method:', error.config?.method?.toUpperCase());
      console.log('상태 코드:', error.response?.status);
      console.log('에러 메시지:', error.response?.data?.message || error.message);
      console.log('에러 상세:', JSON.stringify(error.response?.data, null, 2));
    }

    if (error.response?.status === 401) {
      console.log('[api] 401 Unauthorized - 로그아웃 처리');
      await removeToken();
      if (typeof unauthorizedHandler === 'function') {
        try {
          unauthorizedHandler();
        } catch (_) {
          // noop
        }
      }
    }

    // 500 에러도 로깅
    if (error.response?.status === 500) {
      console.error('[api] 500 서버 에러 - 백엔드 확인 필요');
    }

    return Promise.reject(error);
  },
);

export default api;
