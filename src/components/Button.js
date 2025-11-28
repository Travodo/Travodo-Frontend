import { View, Pressable, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

function Button({ text, style, onPress }) {
  return (
    <View style={styles.container}>
      <Pressable style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 332,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#769FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});

export default Button;
