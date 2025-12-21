import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

function MemoScreen({ route, navigation }) {
  const memo = route.params?.memo;
  const onSave = route.params?.onSave;

  const [title, setTitle] = useState(memo?.title || '');
  const [content, setContent] = useState(memo?.content || '');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('제목을 입력하세요');
      return;
    }

    onSave?.({
      id: memo?.id || Date.now(),
      title,
      content,
    });

    navigation.goBack();
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
