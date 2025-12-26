import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ToggleSwitch from './ToggleSwitch';
import { colors } from '../styles/colors';

function SettingItem({ label, type, value, onToggle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={type === 'navigation' ? 0.6 : 1}
      onPress={onPress}
      disabled={type === 'toggle'}
    >
      <Text style={styles.label}>{label}</Text>

      {type === 'toggle' && <ToggleSwitch value={value} onValueChange={onToggle} />}

      {type === 'navigation' && (
        <MaterialIcons name="chevron-right" size={24} color={colors.grayscale[400]} />
      )}
    </TouchableOpacity>
  );
}

export default SettingItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 7,
    borderBottomWidth: 1,
    borderColor: colors.grayscale[300],
    minHeight: 56,
  },

  label: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
    flex: 1,
  },
});
