import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function TextField({ style, placeholder, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={'#B9B9B9'}
        onChangeText={onChangeText}
      />
    </View>
  );
}

TextField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 332,
    height: 52,
    borderRadius: 8,
    borderColor: colors.grayscale[100],
    fontFamily: 'Pretendard-Regular',
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingLeft: 20,
    fontSize: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default TextField;
