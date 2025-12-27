import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import ProfileImage from '../../../assets/SettingImage/ProfileImage.svg';
import { useNavigation } from '@react-navigation/native';
import {
  getMyInfo,
  deleteAccount as deleteAccountApi,
  uploadMyProfileImage,
} from '../../services/api';
import { signOut } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

function ProfileScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [me, setMe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyInfo();
      setMe(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // AuthContext에서 로그인 시 내정보를 캐싱하지만, 첫 진입에서 한 번 더 보장적으로 동기화
    refreshMe().catch(() => {});
  }, [refreshMe]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ProfileEditScreen')}>
          <Text
            style={{
              paddingRight: 10,
              fontFamily: 'Pretendard-SemiBold',
              color: colors.primary[700],
              fontSize: 16,
            }}
          >
            수정
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handlePickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진 접근 권한을 허용해주세요.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled) return;
      const uri = result.assets?.[0]?.uri;
      if (!uri) return;
      await uploadMyProfileImage(uri);
      await refreshMe();
    } catch (e) {
      console.error('프로필 이미지 업로드 실패:', e);
      Alert.alert('실패', '사진 수정에 실패했습니다.');
    }
  };

  const formatBirthDate = (birthDate) => {
    if (!birthDate) return '';
    return String(birthDate).replace(/-/g, '.');
  };

  const formatGender = (gender) => {
    if (gender === 'MALE') return '남성';
    if (gender === 'FEMALE') return '여성';
    return '';
  };

  const Logout = () => {
    Alert.alert(
      '로그아웃 하시겠습니까?',
      '',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            await signOut();
            logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  const Leave = () => {
    Alert.alert(
      '계정 탈퇴',
      '계정 탈퇴 시 회원님이 참여했던 \n모든 진행 중인 여행 및 공유된 협업 기록에서 \n자동으로 제외됩니다.\n\nTravodo를 떠나시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccountApi();
            } finally {
              logout();
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} bounces={false} overScrollMode="never">
        <View style={styles.profileSection}>
          <View style={styles.profileWrapper}>
            {me?.profileImageUrl ? (
              <Image source={{ uri: me.profileImageUrl }} style={styles.profileImage} />
            ) : (
              <ProfileImage width={100} height={100} />
            )}
            <TouchableOpacity style={styles.addButton} onPress={handlePickProfileImage}>
              <MaterialIcons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Pressable onPress={handlePickProfileImage}>
            <Text style={styles.editText}>사진 수정</Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <InfoRow label="이름" value={isLoading ? '' : me?.name || ''} />
          <InfoRow label="닉네임" value={isLoading ? '' : me?.nickname || ''} />
          <InfoRow label="이메일" value={isLoading ? '' : me?.email || ''} />
          <InfoRow label="생년월일" value={isLoading ? '' : formatBirthDate(me?.birthDate)} />
          <InfoRow label="성별" value={isLoading ? '' : formatGender(me?.gender)} />
          <InfoRow label="연락처" value={isLoading ? '' : me?.phoneNumber || ''} />

          <TouchableOpacity onPress={Logout}>
            <Text style={styles.link}>로그아웃</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={Leave}>
            <Text style={[styles.link, { marginTop: 20, color: '#E71E25' }]}>계정 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  profileWrapper: {
    position: 'relative',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  editText: {
    color: colors.primary[800],
    marginTop: 0,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },

  infoBox: {
    borderTopWidth: 1,
    borderColor: colors.grayscale[300],
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.grayscale[300],
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  label: {
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    width: '30%',
  },

  valueContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  value: {
    color: colors.grayscale[900],
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    flex: 1,
  },

  link: {
    color: '#3C74D4',
    marginTop: 24,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    marginHorizontal: 20,
  },
});