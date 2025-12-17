import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

function MemoScreen({ route, navigation }) {
  const { title } = route.params;
  const [content, setContent] = useState(title);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.saveText}>저장</Text>
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
