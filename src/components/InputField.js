import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function InputField({ style, placeholder }) {
  return (
    <View style={styles.container}>
      <TextInput style={[styles.input, style]} placeholder={placeholder} />
    </View>
  );
}

InputField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 6,
    width: 247,
    height: 50,
    borderColor: '#EAEAEA',
    padding: 10,
    textAlign: 'center',
  },
});

export default InputField;
