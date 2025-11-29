import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function InputField({ style, placeholder, onChangeText }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={colors.grayscale[500]}
      onChangeText={onChangeText}
    />
  );
}

InputField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 6,
    width: 247,
    borderColor: colors.grayscale[300],
    textAlign: 'center',
    color: '#000',
    padding: 10,
  },
});

export default InputField;
