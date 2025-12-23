import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChecklistRow from '../components/ChecklistRow';
import Plus from '../../assets/ProfileImg/Plus.svg';

export function renderSection({
  title,
  list = [],
  setter,
  sectionKey,
  adding,
  setAdding,
  text,
  setText,
  addItem,
  deleteItem,
  editItem,
  toggleCheck,
  assignTraveler,
  showAssignee = false,
  styles,
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {list.map((item, index) => (
        <ChecklistRow
  key={item.id}
  content={item.content}
  travelerName={item.travelerName}
  travelerColor={item.travelerColor}
  checked={!!item.checked}
  onCheck={() => toggleCheck?.(list, setter, index)}
  showAssignee={showAssignee}
  onAssign={() => {
    console.log('onAssign 연결됨'); 
    assignTraveler(list, setter, index);
  }}
  onDelete={() => deleteItem(list, setter, index)}
  onEdit={(value) => editItem(list, setter, index, value)}
/>

      ))}

      {adding === sectionKey && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
            placeholder="내용을 입력하세요"
            onSubmitEditing={() => addItem(setter, list)}
          />
          <Pressable onPress={() => setAdding(null)}>
            <MaterialIcons name="close" size={22} />
          </Pressable>
        </View>
      )}

      <View style={styles.plusCenter}>
        <Pressable onPress={() => setAdding(sectionKey)}>
          <Plus width={24} height={24} />
        </Pressable>
      </View>
    </View>
  );
}
