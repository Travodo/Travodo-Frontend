import { View, StyleSheet, Pressable, Text, Image, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Logo from '../../assets/Logo/TravodoLogo.svg';
import TextField from '../components/TextField';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import KakaoLoginButton from '../components/KakaoLoginButton';
import { signInWithKakao, linkKakaoAccount } from '../services/authService';
import { logKeyHash } from '../utils/getKeyHash';

function SignInScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // 개발 중 Android 키 해시 확인 (콘솔에서 확인 후 카카오 개발자 콘솔에 등록)
    if (__DEV__) {
      logKeyHash();
    }
  }, [navigation]);

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await signInWithKakao();

      if (result.success) {
        // 로그인 성공 - 메인 화면으로 이동
        const nickname = result.data?.nickname || '사용자';
        Alert.alert('로그인 성공', `환영합니다, ${nickname}님!`, [
          {
            text: '확인',
            onPress: () => {
              navigation.replace('MainTab');
            },
          },
        ]);
      } else if (result.needsLink) {
        // 계정 통합 필요
        const { email, existingProvider, providerId } = result.linkData;
        const providerName = existingProvider === 'EMAIL' ? '이메일' : '소셜';

        Alert.alert(
          '계정 통합',
          `${providerName}로 가입된 계정이 있습니다.\n계정을 통합하시겠습니까?`,
          [
            { text: '취소', style: 'cancel' },
            {
              text: '통합하기',
              onPress: async () => {
                setIsLoading(true);
                const linkResult = await linkKakaoAccount(email, providerId);
                setIsLoading(false);

                if (linkResult.success) {
                  Alert.alert('성공', '계정이 통합되었습니다!', [
                    {
                      text: '확인',
                      onPress: () => {
                        navigation.replace('MainTab');
                      },
                    },
                  ]);
                } else {
                  Alert.alert('오류', linkResult.error);
                }
              },
            },
          ],
        );
      } else {
        // 로그인 실패
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
      console.error('카카오 로그인 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Logo width={150} height={28} margin={90} />
      </View>
      <TextField style={{ marginBottom: 4 }} placeholder={'이메일 입력'} />
      <TextField style={{ marginBottom: 8 }} placeholder={'비밀번호 입력'} />
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => console.log('아이디 찾기')}>
          <Text style={styles.textButton}>아이디 찾기</Text>
        </Pressable>
        <Pressable onPress={() => console.log('비밀번호 찾기')}>
          <Text style={styles.textButton}>비밀번호 찾기</Text>
        </Pressable>
      </View>
      <Button style={{ marginTop: 74 }} text={'로그인'} onPress={() => console.log('로그인')} />
      <View style={styles.signUpContainer}>
        <Text
          style={{ fontFamily: 'Pretendard-Medium', color: colors.grayscale[400], fontSize: 12 }}
        >
          계정이 없으신가요?
        </Text>
        <Pressable onPress={() => navigation.push('Sign Up')}>
          <Text
            style={{ fontFamily: 'Pretendard-SemiBold', fontSize: 12, color: colors.primary[700] }}
          >
            회원가입
          </Text>
        </Pressable>
      </View>
      <View style={styles.anotherLogin}>
        <View style={styles.line} />
        <Text style={styles.anotherLoginText}>다른 방법으로 로그인</Text>
        <View style={styles.line} />
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 35 }} size="large" color={colors.primary[700]} />
      ) : (
        <KakaoLoginButton style={{ marginTop: 35 }} onPress={handleKakaoLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 52,
  },
  textButton: {
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[600],
    fontSize: 12,
  },
  signUpContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  line: {
    backgroundColor: colors.grayscale[400],
    height: 1,
    width: 81,
  },
  anotherLogin: {
    marginTop: 91,
    flexDirection: 'row',
    alignItems: 'center',
    width: 310,
    justifyContent: 'space-between',
  },
  anotherLoginText: {
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[400],
    fontSize: 12,
  },
  kakaoLogin: {
    width: 104,
    height: 36,
  },
});

export default SignInScreen;
