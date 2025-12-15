import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const CODE_LENGTH = 5;

function CodeInput({ value, onChange }) {
  const inputRef = useRef([]);

  const handleChange = (text, index) => {
    const newCode = value.split('');
    newCode[index] = text.slice(-1);
    const joined = newCode.join('');
    onChange(joined);

    if (text && index < CODE_LENGTH - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => (inputRef.current[i] = el)}
          style={styles.box}
          value={value[i] || ''}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
}

export default CodeInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },

  box: {
    width: 42,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    fontSize: 32,
    color: colors.grayscale[900],
    fontFamily: 'Pretendard-Medium',
  },
});
