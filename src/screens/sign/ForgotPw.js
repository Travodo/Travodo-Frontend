import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';

function ForgotPw() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>비밀번호 찾기</Text>
        <Text style={styles.subTitle}>닉네임과 이메일을 입력해주세요.</Text>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.inputTitile}>닉네임</Text>
          <TextField placeholder="닉네임" />
        </View>
        <View>
          <Text style={styles.inputTitile}>본인확인 이메일</Text>
          <TextField placeholder="본인확인 이메일" />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button text="다음" style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'left',
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 35,
    paddingTop: 50,
    gap: 55,
  },
  titleContainer: {
    textAlign: 'left',
    gap: 5,
  },
  title: {
    fontWeight: 600,
    fontSize: 24,
    fontFamily: 'Pretendard',
  },
  subTitle: {
    fontWeight: 400,
    fontSize: 22,
    color: '#292929',
    fontFamily: 'Pretendard',
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  inputTitile: {
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 12,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    width: 86,
  },
});

export default ForgotPw;
