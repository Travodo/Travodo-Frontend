import { Platform } from 'react-native';
import { getKeyHashAndroid } from '@react-native-seoul/kakao-login';

/**
 * Android 키 해시를 가져와서 콘솔에 출력합니다.
 * 개발 중에만 사용하고, 출력된 키 해시를 카카오 개발자 콘솔에 등록하세요.
 */
export async function logKeyHash() {
  if (Platform.OS === 'android') {
    try {
      const keyHash = await getKeyHashAndroid();
      console.log('='.repeat(50));
      console.log('📱 Android 키 해시 (카카오 개발자 콘솔에 등록하세요):');
      console.log(keyHash);
      console.log('='.repeat(50));
      return keyHash;
    } catch (error) {
      console.error('키 해시를 가져올 수 없습니다:', error);
      return null;
    }
  } else {
    console.log('iOS는 키 해시가 필요하지 않습니다.');
    return null;
  }
}

