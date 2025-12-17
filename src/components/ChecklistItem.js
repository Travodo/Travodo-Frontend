import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

export default function ChecklistItem({ content, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  return (
    <View style={styles.container}>
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
          <Text style={styles.text}>{text}</Text>
        </Pressable>
      )}

      <Pressable onPress={onDelete}>
        <MaterialIcons name="close" size={20} color={colors.grayscale[600]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  text: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },

  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
  },
});
