import { View, Pressable, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';

function Button({ text, style, onPress, disable = false }) {
  return (
    <Pressable
      style={[
        styles.button,
        style,
        !disable
          ? { backgroundColor: colors.primary[700] }
          : { backgroundColor: colors.primary[400] },
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
  disable: PropTypes.bool,
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: '#769FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 20,
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});

export default Button;
