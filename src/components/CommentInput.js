import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import SendIcon from '../../assets/ComponentsImage/SendIcon.svg';
import { colors } from '../styles/colors';

function CommentInput() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="댓글을 입력하세요."
        placeholderTextColor={colors.grayscale[500]}
      />
      <Pressable style={styles.button} onPress={() => console.log('전송')}>
        <SendIcon width={20} height={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 44,
    paddingTop: 10,
    boxShadow: [
      {
        offsetX: 1,
        offsetY: 0,
        blurRadius: 8,
        spreadDistance: 1,
        color: '#00000014',
      },
    ],
  },
  input: {
    height: 36,
    width: '90%',
    backgroundColor: colors.grayscale[300],
    borderRadius: 8,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    paddingLeft: 12,
  },
  button: {
    position: 'absolute',
    right: '30',
    top: 13,
  },
});

export default CommentInput;
