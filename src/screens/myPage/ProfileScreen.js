import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import ProfileImage from '../../../assets/SettingImage/ProfileImage.svg';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const navigation = useNavigation();
  
  const Logout = () => {
    Alert.alert(
      '로그아웃 하시겠습니까?',
      '',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => console.log('로그아웃 처리 실행') },
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
        { text: '확인', onPress: () => console.log('탈퇴 처리 실행') },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} bounces={false} overScrollMode="never">
        <View style={styles.profileSection}>
          <View style={styles.profileWrapper}>
            <ProfileImage width={100} height={100} />
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.editText}>사진 수정</Text>
        </View>

        <View style={styles.infoBox}>
          <InfoRow label="이름" value="홍길동" />
          <InfoRow label="닉네임" value="honghong123" />
          <InfoRow label="이메일" value="hong@naver.com" />
          <InfoRow label="생년월일" value="2005.05.05" />
          <InfoRow label="성별" value="남성" />
          <InfoRow label="연락처" value="+821012345678" />

          <TouchableOpacity onPress={Logout}>
            <Text style={styles.link}>로그아웃</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={Leave}>
            <Text style={[styles.link, { marginTop: 20, color: '#E71E25' }]}>계정 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.value}>{value}</Text>
    </View>
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
    marginTop: 40,
    marginBottom: 20,
  },

  profileWrapper: {
    position: 'relative',
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
    textAlign: 'left',
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
    width: '100%',
    textAlign: 'left',
    paddingLeft: '35%',
  },

  link: {
    color: '#3C74D4',
    marginTop: 24,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    marginHorizontal: 20,
  },
});
