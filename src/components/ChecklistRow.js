import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from './Checkbox';
import { colors } from '../styles/colors';

export default function ChecklistRow({
  content,
  travelerName,
  travelerColor,
  showAssignee,
  onAssign,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState(content);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Checkbox size={24} checked={isChecked} onPress={() => setIsChecked((prev) => !prev)} />

        {isEditing ? (
          <TextInput
            style={styles.input}
            value={text}
            autoFocus
            onChangeText={setText}
            onSubmitEditing={() => {
              onEdit(text);
              setIsEditing(false);
            }}
          />
        ) : (
          <Pressable onPress={() => setIsEditing(true)} style={{ flex: 1 }}>
            <Text style={[styles.text, isChecked && styles.checkedText]}>{text}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.rightSection}>
        {showAssignee && (
          <Pressable onPress={onAssign} style={styles.assignButton}>
            {travelerName ? (
              <View style={[styles.badge, { backgroundColor: travelerColor + '33' }]}>
                <Text style={[styles.badgeText, { color: travelerColor }]}>{travelerName}</Text>
              </View>
            ) : (
              <MaterialIcons name="person-add" size={20} color={colors.grayscale[500]} />
            )}
          </Pressable>
        )}

        <Pressable onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.grayscale[700],
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
  },
  deleteButton: {
    padding: 4,
  },
});
