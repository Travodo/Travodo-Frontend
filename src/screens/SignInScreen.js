import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import Logo from '../../assets/Logo/TravodoLogo.svg';
import TextField from '../components/TextField';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import KakaoLoginButton from '../components/KakaoLoginButton';

function SignInScreen() {
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
        <Pressable onPress={() => console.log('회원가입')}>
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
      <KakaoLoginButton style={{ marginTop: 35 }} onPress={() => console.log('카카오 로그인')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
