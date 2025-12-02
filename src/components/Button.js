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
    borderRadius: 12,
    backgroundColor: '#769FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 340,
    height: 55,
    paddingVertical: 20,
    marginBottom: 40
  },

  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.grayscale[100],
  },
});

export default Button;
