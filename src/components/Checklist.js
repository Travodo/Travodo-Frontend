import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Checkbox from './Checkbox';
import { colors } from '../styles/colors';

export default function ChecklistItem({ content, name }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pressable onPress={() => setIsChecked(!isChecked)}>
          <Checkbox size={24} />
        </Pressable>
        <Text style={[styles.text, isChecked && styles.checkedText]}>
          {content}
        </Text>
      </View>

      <View style={styles.nameBox}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: colors.grayscale[1000]
  },

  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.grayscale[700]
  },

  nameBox: {
    backgroundColor: '#769FFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14
  },

  nameText: {
    color: colors.grayscale[100],
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14
  },
});
