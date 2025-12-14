import {
  login as kakaoLogin,
  getProfile as kakaoGetProfile,
} from '@react-native-seoul/kakao-login';
import {
  loginWithKakao,
  linkSocialAccount,
  getToken,
  removeToken,
  loginWithEmail,
  signupWithEmail,
  sendEmailVerification,
  verifyEmailCode,
  checkNicknameDuplicate,
} from './api';

/**
 * 카카오 로그인 전체 플로우
 * 1. 카카오 네이티브 SDK로 로그인하여 액세스 토큰 획득
 * 2. 백엔드에 액세스 토큰 전송하여 로그인 처리
 * @returns {Promise<{success: boolean, data?: object, error?: string, needsLink?: boolean, linkData?: object}>}
 */
export async function signInWithKakao() {
  try {
    // 1. 카카오 네이티브 로그인
    const token = await kakaoLogin();

    if (!token || !token.accessToken) {
      return {
        success: false,
        error: '카카오 로그인 토큰을 받지 못했습니다.',
      };
    }

    // 2. 백엔드로 액세스 토큰 전송
    const response = await loginWithKakao(token.accessToken);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('카카오 로그인 에러:', error);

    // 계정 통합 필요 (409 Conflict)
    if (error.response?.status === 409 && error.response?.data?.needsConfirmation) {
      const errorData = error.response.data;

      try {
        // 카카오 사용자 정보 가져오기 (providerId 필요)
        const kakaoUserInfo = await kakaoGetProfile();
        const providerId = kakaoUserInfo?.id ? String(kakaoUserInfo.id) : null;

        if (!providerId) {
          return {
            success: false,
            error: '카카오 사용자 정보를 가져올 수 없습니다.',
          };
        }

        return {
          success: false,
          needsLink: true,
          linkData: {
            email: errorData.email,
            existingProvider: errorData.existingProvider || 'EMAIL',
            providerId,
          },
        };
      } catch (profileError) {
        return {
          success: false,
          error: '카카오 프로필 조회에 실패했습니다.',
        };
      }
    }

    // 에러 메시지 처리
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 이메일 로그인
 */
export async function signInWithEmail(email, password) {
  try {
    const response = await loginWithEmail({ email, password });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('이메일 로그인 에러:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 회원가입
 */
export async function signUp(nickname, email, password) {
  try {
    console.log('=== 회원가입 요청 ===');
    console.log('닉네임:', nickname);
    console.log('이메일:', email);
    const response = await signupWithEmail({ nickname, email, password });
    console.log('회원가입 응답:', response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('회원가입 에러:', error);
    console.error('에러 상태:', error.response?.status);
    console.error('에러 데이터:', JSON.stringify(error.response?.data, null, 2));
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 이메일 인증번호 요청
 */
export async function requestEmailVerification(email) {
  try {
    const response = await sendEmailVerification(email);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('이메일 인증 요청 에러:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 이메일 인증번호 확인
 */
export async function confirmEmailVerification(email, code) {
  try {
    const response = await verifyEmailCode(email, code);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('이메일 인증 확인 에러:', error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 닉네임 중복 확인
 */
export async function checkNickname(nickname) {
  try {
    const response = await checkNicknameDuplicate(nickname);
    console.log('=== 닉네임 중복 확인 API 응답 ===');
    console.log('응답:', JSON.stringify(response, null, 2));
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('닉네임 중복 확인 에러:', error);
    console.error('에러 응답:', error.response?.data);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

/**
 * 계정 통합 (이메일 계정에 카카오 연동)
 */
export async function linkKakaoAccount(email, providerId) {
  try {
    const response = await linkSocialAccount(email, 'KAKAO', providerId);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('계정 통합 에러:', error);
    return {
      success: false,
      error: error.response?.data?.message || '계정 통합에 실패했습니다.',
    };
  }
}

/**
 * 로그인 상태 확인
 */
export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    await removeToken();
    return { success: true };
  } catch (error) {
    console.error('로그아웃 에러:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 에러 메시지 변환
 */
function getErrorMessage(error) {
  // 사용자 취소
  if (error.message?.includes('cancel') || error.message?.includes('취소')) {
    return '로그인이 취소되었습니다.';
  }

  // 네트워크 에러
  if (error.code === 'ECONNABORTED') {
    return '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.';
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return '서버에 연결할 수 없습니다.';
  }

  // HTTP 상태 코드별 처리
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || '잘못된 요청입니다.';
      case 401:
        return '인증에 실패했습니다.';
      case 403:
        return '카카오 로그인 권한이 없습니다. 카카오 개발자 콘솔 설정을 확인해주세요.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return data?.message || `서버 오류 (${status})`;
    }
  }

  return error.message || '알 수 없는 오류가 발생했습니다.';
}
