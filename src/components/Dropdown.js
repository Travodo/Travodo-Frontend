import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

function Dropdown({ sortOrder, visible, onToggle, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.sortButton} onPress={onToggle}>
        <Text style={styles.sortText}>{sortOrder === 'latest' ? '최신순' : '오래된순'}</Text>
        <MaterialIcons name="arrow-drop-down" size={22} color={colors.grayscale[800]} />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdown}>
          <Pressable onPress={() => onSelect('latest')}>
            <Text style={[styles.dropdownText, sortOrder === 'latest' && styles.activeText]}>
              최신순
            </Text>
          </Pressable>

          <Pressable onPress={() => onSelect('oldest')}>
            <Text style={[styles.dropdownText, sortOrder === 'oldest' && styles.activeText]}>
              오래된순
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default Dropdown;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    zIndex: 10,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  sortText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
  },

  dropdown: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    overflow: 'hidden',
    marginTop: 2,
    top: '100%',
    left: 0,
    width: 100,
    zIndex: 10,
    elevation: 4,
    backgroundColor: colors.primary[100],
  },

  dropdownText: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[800],
    fontSize: 14,
  },

  activeText: {
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    backgroundColor: colors.primary[100],
  },
});
