import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultProfile from '../../assets/ProfileImg/profile.svg';
import { colors } from '../styles/colors';

export default function TravelerAvatar({ name, color }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <DefaultProfile width={20} height={20} />
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
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
    marginBottom: 6,
  },

  name: {
    fontSize: 12,
    color: colors.grayscale[900],
    fontFamily: 'Pretendard-Regular',
  },
});
