import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Checkbox from './Checkbox';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

export default function ChecklistItem({
  content,
  name,
  checkboxSize = 24,
  containerStyle,
  nameBoxStyle,
  textStyle,
}) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.left}>
        <Pressable onPress={() => setIsChecked(!isChecked)}>
          <Checkbox size={checkboxSize} />
        </Pressable>

        <Text style={[styles.text, textStyle, isChecked && styles.checkedText]}>{content}</Text>
      </View>

      <View style={[styles.nameBox, nameBoxStyle]}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
}

ChecklistItem.propTypes = {
  content: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checkboxSize: PropTypes.number,
  containerStyle: PropTypes.object,
  nameBoxStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: colors.grayscale[1000],
  },

  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.grayscale[700],
  },

  nameBox: {
    backgroundColor: '#769FFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  nameText: {
    color: colors.grayscale[100],
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
  },
});
