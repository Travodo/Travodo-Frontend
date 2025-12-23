/**
 * Travodo API Smoke Test (실서버 호출)
 *
 * 사용 예:
 *  - HEALTH 체크만:
 *      BASE_URL=https://travodo.duckdns.org/api node scripts/api-smoke-test.js
 *
 *  - 이메일 로그인으로 토큰 발급 후(성공 시) 인증 API까지 테스트:
 *      BASE_URL=https://travodo.duckdns.org/api EMAIL=you@example.com PASSWORD=pass node scripts/api-smoke-test.js
 *
 *  - 이미 토큰이 있으면:
 *      BASE_URL=https://travodo.duckdns.org/api TOKEN="Bearer xxx" node scripts/api-smoke-test.js
 */

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'https://travodo.duckdns.org/api';
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const TOKEN = process.env.TOKEN; // "Bearer xxx" 또는 raw token

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

const normalizeAuthHeader = (token) => {
  if (!token) return null;
  if (token.toLowerCase().startsWith('bearer ')) return token;
  return `Bearer ${token}`;
};

async function main() {
  console.log('[smoke] BASE_URL =', BASE_URL);

  // 1) Health
  try {
    const res = await client.get('/health');
    console.log('[smoke] GET /health OK:', res.status);
  } catch (e) {
    console.error('[smoke] GET /health FAIL:', e.response?.status, e.message);
    process.exitCode = 1;
    return;
  }

  // 2) Token 확보 (env TOKEN 또는 EMAIL/PASSWORD로 login)
  let authHeader = normalizeAuthHeader(TOKEN);
  if (!authHeader && EMAIL && PASSWORD) {
    try {
      const res = await client.post('/auth/login', { email: EMAIL, password: PASSWORD });
      const token = res.data?.token;
      if (!token) throw new Error('token missing in /auth/login response');
      authHeader = normalizeAuthHeader(token);
      console.log('[smoke] POST /auth/login OK:', res.status);
    } catch (e) {
      console.error('[smoke] POST /auth/login FAIL:', e.response?.status, e.response?.data || e.message);
      process.exitCode = 1;
      return;
    }
  }

  if (!authHeader) {
    console.log('[smoke] TOKEN/EMAIL+PASSWORD가 없어 인증 API 테스트는 스킵합니다.');
    return;
  }

  client.defaults.headers.Authorization = authHeader;

  // 3) 인증 API 스모크
  const calls = [
    ['GET', '/users/me'],
    ['GET', '/users/me/posts?page=0&size=5'],
    ['GET', '/trips/me/trips?status=PAST'],
    ['GET', '/trips/upcoming'],
    ['GET', '/trips/current'],
    ['POST', '/auth/logout'],
  ];

  for (const [method, url] of calls) {
    try {
      const res = await client.request({ method, url });
      console.log(`[smoke] ${method} ${url} OK:`, res.status);
    } catch (e) {
      console.error(`[smoke] ${method} ${url} FAIL:`, e.response?.status, e.response?.data || e.message);
      process.exitCode = 1;
      // 계속 진행해서 전체 실패 목록을 보여줌
    }
  }
}

main().catch((e) => {
  console.error('[smoke] UNCAUGHT:', e);
  process.exitCode = 1;
});


