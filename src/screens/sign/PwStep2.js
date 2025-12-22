import { Modal, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';
import { useState } from 'react';
import CheckCircleBlue from '../../../assets/ComponentsImage/CheckCircleBlue.svg';

function PwStep2({ navigation }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>새 비밀번호를 입력해 주세요</Text>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.inputTitile}>새 비밀번호</Text>
          <TextField placeholder="비밀번호" />
          <Text style={styles.inputTitile2}>
            영문 대/소문자, 숫자, 특수문자를 사용하여 8~16자로 설정해 주세요.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button text="다음" style={styles.button} onPress={() => setVisible(!visible)} />
      </View>
      {visible && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <CheckCircleBlue width={18} height={18} />
            <Text style={[styles.title, { fontSize: 16 }]}>비밀번호를 변경했어요</Text>
            <Text style={[styles.title, { fontSize: 16 }]}>로그인해 주세요</Text>
            <Button
              text="확인"
              style={{ width: 152, marginTop: 36 }}
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      )}
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
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
  subTitle: {
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
  inputTitile2: {
    color: colors.grayscale[500],
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 4,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    width: 86,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 304,
    height: 210,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PwStep2;
