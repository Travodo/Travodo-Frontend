import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CodeInput from '../../components/CodeInput';
import { colors } from '../../styles/colors';
import Button from '../../components/Button';

function JoinScreen() {
  const [code, setCode] = useState('');

  const handleJoin = () => {
    console.log('입력한 코드: ', code);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>코드 입력</Text>
          <Text style={styles.sub}>참가하실 여행 초대 코드를 입력하세요!</Text>

          <CodeInput value={code} onChange={setCode} />

          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Button text="참가하기" onPress={handleJoin} />
          </View>

          <TouchableOpacity
            style={[styles.button, code.length !== 6 && { opacity: 0.5 }]}
            disabled={code.length !== 6}
            onPress={handleJoin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default JoinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.grayscale[100],
  },

  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 6,
  },

  sub: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[900],
    marginBottom: 75,
    textAlign: 'center',
  },
});
