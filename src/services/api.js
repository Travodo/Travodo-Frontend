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

// 401 핸들러 및 토큰 관리
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const TOKEN_KEY = '@travodo/token';

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

// -----------------------------
// Auth
// -----------------------------
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

export const getMyInfo = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const loginWithEmail = async (data) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

export const signupWithEmail = async (data) => {
  const response = await api.post('/auth/signup', data);
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

export const sendEmailVerification = async (email) => {
  const response = await api.post('/auth/email/verification/send', { email });
  return response.data;
};

export const verifyEmailCode = async (email, code) => {
  const response = await api.post('/auth/email/verification/confirm', { email, code });
  return response.data;
};

export const checkNicknameDuplicate = async (nickname) => {
  const response = await api.get('/auth/nickname/check', { params: { nickname } });
  return response.data;
};

export const findEmail = async (email, code) => {
  const response = await api.post('/auth/email/find', { email, code });
  return response.data;
};

export const resetPassword = async (email, code, newPassword) => {
  const response = await api.post('/auth/password/reset', {
    email,
    code,
    newPassword,
  });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/auth/password/change', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const linkSocialAccount = async (email, provider, providerId) => {
  const response = await api.post('/auth/account/link/social', null, {
    params: { email, provider, providerId },
  });
  if (response.data.token) {
    await setToken(response.data.token);
  }
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/auth/account');
  await removeToken();
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  await removeToken();
  return response.data;
};

// -----------------------------
// Users
// -----------------------------
export const updateMyProfile = async (data) => {
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
// Trips (General)
// -----------------------------
export const createTrip = async (data) => {
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

export const getOngoingTrips = async () => {
  const response = await api.get('/trips?status=ONGOING');
  return response.data;
};

// -----------------------------
// Shared Items (공동 준비물)
// -----------------------------
export const getSharedItems = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/shared-items`);
  return response.data;
};

export const createSharedItem = async (tripId, { name, quantity = 1 }) => {
  const response = await api.post(`/trips/${tripId}/shared-items`, { name, quantity });
  return response.data;
};

export const updateSharedItem = async (tripId, itemId, { name, checked }) => {
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (checked !== undefined) payload.checked = checked;

  const response = await api.patch(`/trips/${tripId}/shared-items/${itemId}`, payload);
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

// -----------------------------
// Personal Items (개인 준비물)
// -----------------------------
export const getPersonalItems = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/personal-items`);
  return response.data;
};

export const createPersonalItem = async (tripId, { name }) => {
  const response = await api.post(`/trips/${tripId}/personal-items`, { name });
  return response.data;
};

export const updatePersonalItem = async (tripId, itemId, { name, checked }) => {
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (checked !== undefined) payload.checked = checked;

  const response = await api.patch(`/trips/${tripId}/personal-items/${itemId}`, payload);
  return response.data;
};

export const deletePersonalItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/personal-items/${itemId}`);
  return response.data;
};

// -----------------------------
// Todo (필수 할 일)
// -----------------------------
export const getTodos = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/todo`);
  return response.data;
};

export const createTodo = async (tripId, { title }) => {
  // UI에서는 { title }로 전송
  const response = await api.post(`/trips/${tripId}/todo`, { title });
  return response.data;
};

export const updateTodo = async (tripId, todoId, { title, status }) => {
  const payload = {};
  if (title !== undefined) payload.title = title;
  if (status !== undefined) payload.status = status; // 'UNDONE' or 'DONE'

  const response = await api.patch(`/trips/${tripId}/todo/${todoId}`, payload);
  return response.data;
};

export const deleteTodo = async (tripId, todoId) => {
  const response = await api.delete(`/trips/${tripId}/todo/${todoId}`);
  return response.data;
};

export const assignTodo = async (tripId, todoId) => {
  const response = await api.patch(`/trips/${tripId}/todo/${todoId}/assign`);
  return response.data;
};

export const unassignTodo = async (tripId, todoId) => {
  const response = await api.patch(`/trips/${tripId}/todo/${todoId}/unassign`);
  return response.data;
};

// -----------------------------
// Activity (여행 활동)
// -----------------------------
export const getActivities = async (tripId, date) => {
  const response = await api.get(`/trips/${tripId}/activities`, { params: { date } });
  return response.data;
};

export const createActivity = async (tripId, { title, time }) => {
  const response = await api.post(`/trips/${tripId}/activities`, {
    title,
    time: time || new Date().toISOString(),
  });
  return response.data;
};

// 활동 내용 수정 (PUT)
export const updateActivityContent = async (tripId, activityId, { title, time }) => {
  const response = await api.put(`/trips/${tripId}/activities/${activityId}`, {
    title,
    time: time || new Date().toISOString(),
  });
  return response.data;
};

// 활동 상태 변경 (PATCH)
export const updateActivityStatus = async (tripId, activityId, status) => {
  // status: 'PENDING' | 'DONE'
  const response = await api.patch(`/trips/${tripId}/activities/${activityId}/status`, { status });
  return response.data;
};

export const deleteActivity = async (tripId, activityId) => {
  const response = await api.delete(`/trips/${tripId}/activities/${activityId}`);
  return response.data;
};

// -----------------------------
// Memos (메모)
// -----------------------------
export const getMemos = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/memos`);
  return response.data;
};

export const getMemoDetail = async (tripId, memoId) => {
  const response = await api.get(`/trips/${tripId}/memos/${memoId}`);
  return response.data;
};

export const createMemo = async (tripId, { title, content }) => {
  const response = await api.post(`/trips/${tripId}/memos`, { title, content });
  return response.data;
};

export const updateMemo = async (tripId, memoId, { title, content }) => {
  const response = await api.put(`/trips/${tripId}/memos/${memoId}`, { title, content });
  return response.data;
};

export const deleteMemo = async (tripId, memoId) => {
  const response = await api.delete(`/trips/${tripId}/memos/${memoId}`);
  return response.data;
};

// -----------------------------
// Location & Map
// -----------------------------
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
export const getCommunityPosts = async ({
  tag,
  tags,
  sort = 'recent',
  page = 0,
  size = 20,
} = {}) => {
  const params = { sort, page, size };
  if (tag) params.tag = tag;
  if (tags && Array.isArray(tags) && tags.length > 0) {
    params.tags = tags;
  }
  const response = await api.get('/community/posts', {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else if (value != null) {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  });
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

// -----------------------------
// Interceptors
// -----------------------------
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      const hasAuth = !!config.headers?.Authorization;
      console.log(`[api] ${config.method?.toUpperCase()} ${config.url} auth=${hasAuth}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
    return Promise.reject(error);
  },
);

export default api;
