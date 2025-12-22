import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DefaultProfile from '../../assets/ProfileImg/profile.svg';
import DeleteProfile from '../../assets/ProfileImg/delete.svg';
import { colors } from '../styles/colors';

export default function TravelerAvatar({ name, color, selected, onPress, onDelete, showDelete = false }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.wrapper}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: color },
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <DefaultProfile width={24} height={24} 
              color={colors.grayscale[100]} />
            </View>
            
            {showDelete && (
              <Pressable
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                hitSlop={8}
              >
                <DeleteProfile width={16} height={16} />
              </Pressable>
            )}
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

  avatarContainer: {
    position: 'relative',
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

  deleteButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.grayscale[100],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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