import { View, Text, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentInput from '../../components/CommentInput';
import { updateComment } from '../../services/api';

function EditCommentScreen({ route, navigation }) {
  const { comment, onSave } = route.params;

  const [text, setText] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      await updateComment(comment.id, { content: text });

      onSave(text);

      navigation.goBack();
    } catch (e) {
      Alert.alert('오류', '댓글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <CommentInput
          value={text}
          onChangeText={setText}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}

export default EditCommentScreen;
