import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function Dropdown({
  label,
  options = [],
  selectedOption: propSelectedOption,
  visible,
  onToggle,
  onSelect,
  dropdownStyle,
}) {
  const [selected, setSeleted] = useState(propSelectedOption);

  const maxOptionLength = useMemo(() => {
    if (!options.length) return 0;
    return Math.max(...options.map((opt) => opt.length));
  }, [options]);

  const calculateWidth = useMemo(() => Math.max(100, maxOptionLength * 12 + 40), [maxOptionLength]);

  useEffect(() => {
    if (!propSelectedOption && options.length > 0) {
      setSeleted(options[0]);
      onSelect?.(options[0]);
    }
  }, [propSelectedOption, options]);

  const handleSelect = (option) => {
    (setSeleted(option), onSelect?.(option));
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selectBox, { width: calculateWidth }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText}>{selected || '정렬'}</Text>
        <MaterialIcons
          name={visible ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={24}
          color={colors.grayscale[700]}
        />
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, dropdownStyle, { width: calculateWidth }]}>
          {options.map((option, i) => (
            <Pressable
              key={i}
              onPress={() => handleSelect(option)}
              style={[
                styles.option,
                option === selected && styles.activeOptionText,
                i === options.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.optionText, option === selected && styles.activeOptionText]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  selectedOption: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  dropdownStyle: PropTypes.object,
};

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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.grayscale[100],
    backgroundColor: colors.grayscale[100],
  },

  selectedText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[900],
    paddingLeft: 3,
  },

  dropdown: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.grayscale[400],
    overflow: 'hidden',
    top: '100%',
    zIndex: 10,
    elevation: 4,
    backgroundColor: colors.primary[100],
    marginTop: 0,
  },

  option: {
    paddingVertical: 7.5,
    textAlign: 'center',
    borderBottomWidth: 1.2,
    borderColor: colors.grayscale[400],
    backgroundColor: colors.grayscale[100],
  },

  optionText: {
    fontSize: 14,
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
