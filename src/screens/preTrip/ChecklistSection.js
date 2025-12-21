import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChecklistRow from '../../components/ChecklistRow';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { colors } from '../../styles/colors';

function ChecklistSection({
  title,
  list = [],
  setter,
  sectionKey,

  adding,
  setAdding,

  text,
  setText,

  addItem = () => {},
  deleteItem = () => {},
  editItem = () => {},

  showAssignee = false,
}) {
  const handleSubmit = () => {
    addItem(setter, list);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>

      {Array.isArray(list) &&
        list.map((item, index) => {
          const safeItem = item ?? {};
          const id = safeItem.id ?? `${sectionKey}-${index}`;

          return (
            <View key={id} style={styles.rowWrap}>
              <ChecklistRow
                content={safeItem.content ?? ''}
                travelerName={safeItem.travelerName ?? null}
                travelerColor={safeItem.travelerColor ?? null}

                showAssignee={showAssignee}
                onDelete={() => deleteItem(list, setter, index)}
                onEdit={(value) => editItem(list, setter, index, value)}
              />
            </View>
          );
        })}

      {adding === sectionKey && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
            placeholder="내용을 입력하세요"
            placeholderTextColor={colors?.grayscale?.[500] ?? '#999'}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            blurOnSubmit={false}
          />
          <Pressable onPress={() => setAdding(null)} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={colors?.grayscale?.[700] ?? '#666'} />
          </Pressable>
        </View>
      )}

      <View style={styles.plusCenter}>
        <Pressable onPress={() => setAdding(sectionKey)} hitSlop={8}>
          <Plus width={18} height={18} />
        </Pressable>
      </View>
    </View>
  );
}

export default ChecklistSection;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 12,
    color: colors?.grayscale?.[1000] ?? '#111',
  },
  rowWrap: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors?.grayscale?.[400] ?? '#ddd',
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: colors?.grayscale?.[1000] ?? '#111',
  },
  plusCenter: {
    alignItems: 'center',
    marginVertical: 16,
  },
});
