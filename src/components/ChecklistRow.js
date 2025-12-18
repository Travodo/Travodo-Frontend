import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from './Checkbox';
import { colors } from '../styles/colors';

export default function ChecklistRow({ content, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState(content);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable onPress={() => setIsChecked(!isChecked)}>
          <Checkbox size={24} />
        </Pressable>
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
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={20} color={colors.grayscale[600]} />
      </Pressable>
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
