import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const CODE_LENGTH = 6;

function CodeInput({ value, onChange }) {
  const inputRef = useRef([]);
  const [focused, setFocused] = useState(null);

  const handleChange = (text, index) => {
    const newCode = value.split('');
    newCode[index] = text.slice(-1);
    onChange(newCode.join(''));

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
          style={[styles.box, focused === i && styles.boxFocused]}
          value={value[i] || ''}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          onFocus={() => setFocused(i)}
          onBlur={() => setFocused(null)}
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
    borderWidth: 1.1,
    borderColor: colors.grayscale[400],
    fontSize: 28,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Medium',
  },

  boxFocused: {
    borderColor: colors.primary[500],
    borderWidth: 1.3,
  },
});
