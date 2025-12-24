import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import TextField from '../../components/TextField';
import { colors } from '../../styles/colors';
import Button from '../../components/Button';
import KakaoLoginButton from '../../components/KakaoLoginButton';
import {
  signUp,
  checkNickname,
  requestEmailVerification,
  confirmEmailVerification,
  signInWithKakao,
} from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

function SignUpScreen({ navigation }) {
  const { login } = useAuth();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkNickname(nickname);
      console.log('닉네임 확인 결과:', result);

      if (result.success) {
        // 백엔드 응답 구조에 따라 처리
        // available, isAvailable, duplicate, isDuplicate 등 다양한 키 확인
        const data = result.data;
        const isAvailable =
          data?.available ?? data?.isAvailable ?? !data?.duplicate ?? !data?.isDuplicate ?? true;

        if (isAvailable) {
          Alert.alert('확인', '사용 가능한 닉네임입니다.');
          setIsNicknameChecked(true);
        } else {
          Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
          setIsNicknameChecked(false);
        }
      } else {
        // API 에러 (409 등)는 중복으로 처리
        if (result.error?.includes('이미') || result.error?.includes('중복')) {
          Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
        } else {
          Alert.alert('오류', result.error);
        }
        setIsNicknameChecked(false);
      }
    } catch (error) {
      Alert.alert('오류', '닉네임 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 요청
  const handleRequestVerification = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestEmailVerification(email);
      if (result.success) {
        Alert.alert('확인', '인증 코드가 이메일로 전송되었습니다.');
        setIsCodeSent(true);
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '인증 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 확인
  const handleConfirmVerification = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('알림', '인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmEmailVerification(email, verificationCode);
      if (result.success) {
        Alert.alert('확인', '이메일 인증이 완료되었습니다.');
        setIsEmailVerified(true);
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '인증 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입
  const handleSignUp = async () => {
    if (!isNicknameChecked) {
      Alert.alert('알림', '닉네임 중복 확인을 해주세요.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('알림', '비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (!isEmailVerified) {
      Alert.alert('알림', '이메일 인증을 완료해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(nickname, email, password);
      if (result.success) {
        Alert.alert('회원가입 완료', '회원가입이 완료되었습니다!', [
          {
            text: '확인',
            onPress: () => login(),
          },
        ]);
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await signInWithKakao();
      if (result.success) {
        const name = result.data?.nickname || '사용자';
        Alert.alert('로그인 성공', `환영합니다, ${name}님!`, [
          {
            text: '확인',
            onPress: () => login(),
          },
        ]);
      } else {
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[700]} />
        </View>
      )}
      <View style={{ gap: 52 }}>
        <View>
          <Text style={styles.title}>닉네임</Text>
          <View style={styles.rowContainer}>
            <TextField
              placeholder={'닉네임'}
              style={styles.shortInput}
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                setIsNicknameChecked(false);
              }}
            />
            <Button
              text={isNicknameChecked ? '확인완료' : '중복확인'}
              style={[styles.shortButton, isNicknameChecked && styles.confirmedButton]}
              textStyle={styles.shortButtonText}
              onPress={handleCheckNickname}
              disabled={isNicknameChecked}
            />
          </View>
        </View>
        <View>
          <Text style={styles.title}>비밀번호</Text>
          <TextField
            placeholder={'비밀번호 (8자 이상)'}
            style={[styles.padding, { marginBottom: 4 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextField
            placeholder={'비밀번호 확인'}
            style={styles.padding}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />
        </View>
        <View>
          <Text style={styles.title}>이메일</Text>
          <View style={styles.rowContainer}>
            <TextField
              placeholder={'이메일'}
              style={[styles.shortInput, { marginBottom: 4 }]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsCodeSent(false);
                setIsEmailVerified(false);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isEmailVerified}
            />
            <Button
              text={isCodeSent ? '재전송' : '인증요청'}
              style={styles.shortButton}
              textStyle={styles.shortButtonText}
              onPress={handleRequestVerification}
              disabled={isEmailVerified}
            />
          </View>
          <View style={styles.rowContainer}>
            <TextField
              placeholder={'인증코드 6자리를 입력해주세요.'}
              style={[styles.shortInput, { marginBottom: 4 }]}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              editable={isCodeSent && !isEmailVerified}
            />
            <Button
              text={isEmailVerified ? '인증완료' : '확인'}
              style={[styles.shortButton, isEmailVerified && styles.confirmedButton]}
              textStyle={styles.shortButtonText}
              onPress={handleConfirmVerification}
              disabled={!isCodeSent || isEmailVerified}
            />
          </View>
        </View>
      </View>
      <Button
        text={'가입하기'}
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading}
      />
      <View style={styles.anotherLogin}>
        <View style={styles.line} />
        <Text style={styles.anotherLoginText}>다른 방법으로 로그인</Text>
        <View style={styles.line} />
      </View>
      <KakaoLoginButton style={{ marginTop: 35 }} onPress={handleKakaoLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 2,
    marginLeft: 4,
    fontSize: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  padding: {
    paddingVertical: 17,
  },
  shortInput: {
    width: 238,
    paddingVertical: 17,
  },
  shortButton: {
    width: 86,
    paddingVertical: 17,
    borderRadius: 10,
    marginLeft: 8,
  },
  confirmedButton: {
    backgroundColor: colors.grayscale[400],
  },
  shortButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
  signUpButton: {
    marginTop: 72,
    marginBottom: 20,
  },
  anotherLogin: {
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
  line: {
    backgroundColor: colors.grayscale[400],
    height: 1,
    width: 81,
  },
});

export default SignUpScreen;
