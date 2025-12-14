import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

function Dropdown({
  label,
  options = [],
  selectedOption: propSelectedOption,
  visible,
  onToggle,
  onSelect,
  dropdownStyle = {},
}) {
  const [selectedOption, setSeletedOption] = useState(propSelectedOption);

  useEffect(() => {
    if (!propSelectedOption && options.length > 0) {
      setSeletedOption(options[0]);
      onSelect?.(options[0]);
    }
  }, [propSelectedOption, options]);

  const handleSelect = (option) => {
    (setSeletedOption(option), onSelect?.(option));
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.selectBox} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.selectedText}>{selectedOption || '정렬'}</Text>
        <MaterialIcons
          name={visible ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={24}
          color={colors.grayscale[700]}
        />
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, dropdownStyle]}>
          {options.map((option, i) => (
            <Pressable
              key={i}
              onPress={() => handleSelect(option)}
              style={[styles.option, option === selectedOption && styles.activeOptionText]}
            >
              <Text
                style={[styles.optionText, option === selectedOption && styles.activeOptionText]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
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

  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    backgroundColor: colors.grayscale[100],
  },

  selectedText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
  },

  dropdown: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.grayscale[400],
    overflow: 'hidden',
    top: '100%',
    width: 10,
    zIndex: 10,
    elevation: 4,
    backgroundColor: colors.primary[100],
    marginTop: 5,
  },

  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grayscale[300],
  },

  optionText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
    textAlign: 'center',
  },

  activeOptionText: {
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    color: colors.primary[700],
  },
});
