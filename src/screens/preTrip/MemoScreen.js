import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { createMemo, updateMemo } from '../../services/api';

function MemoScreen({ route, navigation }) {
  const memo = route.params?.memo;
  const onSave = route.params?.onSave;
  const tripId = route.params?.tripId;

  const [title, setTitle] = useState(memo?.title || '');
  const [content, setContent] = useState(memo?.content || '');

  const handleSave = async () => {
  if (!title.trim()) {
    Alert.alert('제목을 입력하세요');
    return;
  }

  if (!tripId) {
    Alert.alert('오류', '여행 정보가 없습니다.');
    return;
  }

  try {
    let saved;

    if (memo?.id) {
      saved = await updateMemo(tripId, memo.id, {
        title,
        content,
      });
    }
    else {
      saved = await createMemo(tripId, {
        title,
        content,
      });
    }

    // PrepareScreen에 서버 기준 데이터 전달
    onSave?.({
      id: String(saved.id),
      title: saved.title,
      content: saved.content,
      updatedAt: saved.updatedAt,
    });

    navigation.goBack();
  } catch (e) {
    console.error('메모 저장 실패:', e);
    Alert.alert('실패', '메모 저장에 실패했습니다.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} />
        </Pressable>

        <TextInput
          style={styles.headerTitleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="메모 제목"
          numberOfLines={1}
        />

        <Pressable onPress={handleSave}>
          <Text style={styles.saveText}>저장</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
        placeholder="메모를 입력하세요"
        placeholderTextColor={colors.grayscale[500]}
        textAlignVertical="top"
      />
    </SafeAreaView>
  );
}

export default MemoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[200],
  },

  headerTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
  },

  headerTitleInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginHorizontal: 12,
  },

  saveText: {
    fontSize: 16,
    color: colors.primary[700],
  },

  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
  },
});
