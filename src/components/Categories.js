import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { useState } from 'react';

function Categories({ property, onPress, disable }) {
  return (
    <Pressable
      style={[
        styles.disasbleContainer,
        disable ? { borderColor: colors.primary[700] } : { borderColor: colors.grayscale[400] },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          disable ? { color: colors.primary[700] } : { color: colors.grayscale[400] },
        ]}
      >
        {property}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disasbleContainer: {
    backgroundColor: colors.grayscale[100],
    borderColor: colors.grayscale[400],
    paddingVertical: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10,
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: colors.grayscale[400],
  },
});

export default Categories;
