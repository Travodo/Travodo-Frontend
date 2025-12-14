import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function TextField({
  style,
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable = true,
  maxLength,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style, !editable && styles.disabled]}
        placeholder={placeholder}
        placeholderTextColor={colors.grayscale[500]}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        maxLength={maxLength}
      />
    </View>
  );
}

TextField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  editable: PropTypes.bool,
  maxLength: PropTypes.number,
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
  disabled: {
    backgroundColor: colors.grayscale[100],
  },
});

export default TextField;
