import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function TextField({ style, placeholder, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={colors.grayscale[500]}
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
  input: {
    width: 332,
    borderRadius: 8,
    borderColor: colors.grayscale[200],
    fontFamily: 'Pretendard-Regular',
    borderWidth: 1,
    paddingLeft: 20,
    fontSize: 12,
    paddingVertical: 15,
  },
});

export default TextField;
