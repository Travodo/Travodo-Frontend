import { View, StyleSheet, Text } from 'react-native';
import { useEffect } from 'react';
import SignInScreen from './SignInScreen';
import TextField from '../components/TextField';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import KakaoLoginButton from '../components/KakaoLoginButton';

function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={{ gap: 52 }}>
        <View>
          <Text style={styles.title}>닉네임</Text>
          <View style={styles.rowContainer}>
            <TextField placeholder={'닉네임'} style={styles.shortInput} />
            <Button
              text={'중복확인'}
              style={styles.shortButton}
              textStyle={styles.shortButtonText}
              onPress={() => console.log('중복확인')}
            />
          </View>
        </View>
        <View>
          <Text style={styles.title}>비밀번호</Text>
          <TextField placeholder={'비밀번호'} style={[styles.padding, { marginBottom: 4 }]} />
          <TextField placeholder={'비밀번호 확인'} style={styles.padding} />
        </View>
        <View>
          <Text style={styles.title}>이메일</Text>
          <View style={styles.rowContainer}>
            <TextField placeholder={'이메일'} style={[styles.shortInput, { marginBottom: 4 }]} />
            <Button
              text={'인증요청'}
              style={styles.shortButton}
              textStyle={styles.shortButtonText}
              onPress={() => console.log('인증요청')}
            />
          </View>
          <View style={styles.rowContainer}>
            <TextField
              placeholder={'인증코드 6자리를 입력해주세요.'}
              style={[styles.shortInput, { marginBottom: 4 }]}
            />
            <Button
              text={'확인'}
              style={styles.shortButton}
              textStyle={styles.shortButtonText}
              disable={true}
              onPress={() => console.log('확인')}
            />
          </View>
        </View>
      </View>
      <Button
        text={'가입하기'}
        style={styles.signUpButton}
        onPress={() => navigation.replace('Sign In')}
      />
      <View style={styles.anotherLogin}>
        <View style={styles.line} />
        <Text style={styles.anotherLoginText}>다른 방법으로 로그인</Text>
        <View style={styles.line} />
      </View>
      <KakaoLoginButton style={{ marginTop: 35 }} onPress={() => console.log('카카오 로그인')} />
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
});

export default SignUpScreen;
