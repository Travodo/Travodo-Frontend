import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { useState } from 'react';
import PropTypes from 'prop-types';

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

Categories.propTypes = {
  property: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disable: PropTypes.bool.isRequired,
};

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
