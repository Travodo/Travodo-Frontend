import { View, Pressable, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';

function Button({ text, style, onPress, disable = false, disabled = false, textStyle }) {
  const isDisabled = disable || disabled;

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        style,
        !isDisabled
          ? { backgroundColor: colors.primary[700] }
          : { backgroundColor: colors.grayscale[400] },
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </Pressable>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
  disable: PropTypes.bool,
  disabled: PropTypes.bool,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    backgroundColor: '#769FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 330,
    paddingVertical: 20,
  },

  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.grayscale[100],
  },
});

export default Button;
