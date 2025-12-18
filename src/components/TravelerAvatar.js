import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DefaultProfile from '../../assets/ProfileImg/profile.svg';
import { colors } from '../styles/colors';

export default function TravelerAvatar({ name, color, selected, onPress }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.wrapper}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: color },
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <DefaultProfile width={20} height={20} />
          </View>
          <Text style={[styles.name, selected && styles.selectedName]}>{name}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 56,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },

  selected: {
    borderWidth: 3,
    borderColor: colors.grayscale[500],
  },

  name: {
    fontSize: 12,
    color: colors.grayscale[900],
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },

  selectedName: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.primary[800],
  },
});
