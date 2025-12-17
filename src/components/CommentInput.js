import { View, TextInput, StyleSheet, Pressable, Keyboard, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import SendIcon from '../../assets/ComponentsImage/SendIcon.svg';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function CommentInput({ onChangeText, onPress }) {
  const BOTTOM = 20;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { bottom: keyboardHeight }]}>
      <TextInput
        style={styles.input}
        placeholder="댓글을 입력하세요."
        placeholderTextColor={colors.grayscale[500]}
        onChangeText={onChangeText}
      />
      <Pressable style={styles.button} onPress={onPress}>
        <SendIcon width={20} height={30} />
      </Pressable>
    </View>
  );
}

CommentInput.propTypes = {
  onChangeText: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

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
    right: 30,
    top: 13,
  },
});

export default CommentInput;
