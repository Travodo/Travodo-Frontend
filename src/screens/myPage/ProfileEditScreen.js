import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../styles/colors';
import { updateMyProfile } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ProfileEditScreen({ navigation }) {
  const { me: cachedMe, isMeLoading, refreshMe } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    birthDate: '', // YYYY-MM-DD
    gender: '', // MALE | FEMALE
    phoneNumber: '',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = cachedMe || (await refreshMe());
        if (!mounted) return;
        setForm({
          name: me?.name ?? '',
          nickname: me?.nickname ?? '',
          birthDate: me?.birthDate ?? '',
          gender: me?.gender ?? '',
          phoneNumber: me?.phoneNumber ?? '',
        });
      } catch (e) {
        console.error('프로필 수정용 내 정보 조회 실패:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [cachedMe, refreshMe]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={async () => {
            try {
              await updateMyProfile({
                name: form.name || null,
                nickname: form.nickname || null,
                birthDate: form.birthDate || null,
                gender: form.gender || null,
                phoneNumber: form.phoneNumber || null,
              });
              // 전역 내정보 캐시 동기화
              try {
                await refreshMe();
              } catch (_) {
                // noop
              }
              Alert.alert('완료', '프로필이 수정되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
            } catch (e) {
              console.error('프로필 수정 실패:', e);
              Alert.alert('실패', '프로필 수정에 실패했습니다. 입력값을 확인해주세요.');
            }
          }}
          disabled={loading || isMeLoading}
        >
          <Text style={[styles.headerAction, loading && { opacity: 0.5 }]}>저장</Text>
        </Pressable>
      ),
    });
  }, [navigation, form, loading, isMeLoading, refreshMe]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.help}>
        생년월일은 YYYY-MM-DD 형식으로 입력하세요. (예: 2000-01-31)
      </Text>

      <Field label="이름" value={form.name} onChangeText={(v) => setField('name', v)} />
      <Field label="닉네임" value={form.nickname} onChangeText={(v) => setField('nickname', v)} />
      <Field
        label="생년월일"
        value={form.birthDate}
        onChangeText={(v) => setField('birthDate', v)}
        placeholder="YYYY-MM-DD"
      />
      <View style={styles.genderRow}>
        <Text style={styles.label}>성별</Text>
        <View style={styles.genderButtons}>
          <Pressable
            style={[styles.genderButton, form.gender === 'MALE' && styles.genderButtonActive]}
            onPress={() => setField('gender', 'MALE')}
          >
            <Text style={[styles.genderText, form.gender === 'MALE' && styles.genderTextActive]}>남성</Text>
          </Pressable>
          <Pressable
            style={[styles.genderButton, form.gender === 'FEMALE' && styles.genderButtonActive]}
            onPress={() => setField('gender', 'FEMALE')}
          >
            <Text style={[styles.genderText, form.gender === 'FEMALE' && styles.genderTextActive]}>여성</Text>
          </Pressable>
        </View>
      </View>
      <Field
        label="연락처"
        value={form.phoneNumber}
        onChangeText={(v) => setField('phoneNumber', v)}
        placeholder="01012345678"
        keyboardType="phone-pad"
      />
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayscale[100] },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  help: { color: colors.grayscale[700], fontFamily: 'Pretendard-Regular', fontSize: 13 },
  headerAction: { paddingRight: 10, fontFamily: 'Pretendard-SemiBold', color: colors.primary[700], fontSize: 16 },
  field: { gap: 8 },
  label: { fontFamily: 'Pretendard-SemiBold', color: colors.grayscale[900] },
  input: {
    backgroundColor: colors.grayscale[100],
    borderWidth: 1,
    borderColor: colors.grayscale[300],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Pretendard-Regular',
  },
  genderRow: { gap: 8 },
  genderButtons: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grayscale[300],
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayscale[100],
  },
  genderButtonActive: { borderColor: colors.primary[700], backgroundColor: colors.primary[100] },
  genderText: { fontFamily: 'Pretendard-SemiBold', color: colors.grayscale[800] },
  genderTextActive: { color: colors.primary[800] },
});

export default ProfileEditScreen;


