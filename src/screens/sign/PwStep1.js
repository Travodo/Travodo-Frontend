import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';

function PwStep1({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>메일을 발송했어요</Text>
        <Text style={styles.title}>인증번호를 입력해 주세요</Text>
      </View>
      <View style={styles.inputContainer}>
        <InputField style={{ width: 41, height: 52 }} />
        <InputField style={{ width: 41, height: 52 }} />
        <InputField style={{ width: 41, height: 52 }} />
        <InputField style={{ width: 41, height: 52 }} />
        <InputField style={{ width: 41, height: 52 }} />
        <InputField style={{ width: 41, height: 52 }} />
      </View>
      <View style={styles.bottomContainer}>
        <View
          style={{
            flexDirection: 'column',
            gap: 15,
          }}
        >
          <Text
            style={[
              styles.bottionTitile,
              {
                color: '#769FFF',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                fontFamily: 'Pretendard-SemiBold',
              },
            ]}
          >
            메일 재전송
          </Text>
          <Text style={styles.bottionTitile}>남은 시간 05:00</Text>
        </View>
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
    fontFamily: 'Pretendard-SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
  },
  inputTitile: {
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 2,
    marginLeft: 4,
    fontSize: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  bottionTitile: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    fontWeight: 400,
    color: '#B5B5B5',
  },
  button: {
    width: 86,
  },
});
export default PwStep1;
