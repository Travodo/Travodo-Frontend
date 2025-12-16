import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import SettingItem from '../../components/SettingItem';
import { colors } from '../../styles/colors';

function SettingsScreen({ navigation }) {
  const [dDayAlarm, setDdayAlarm] = useState(true);
  const [updateAlarm, setUpdateAlarm] = useState(false);
  const [adAlarm, setAdAlarm] = useState(false);
  const [gpsAgree, setGpsAgree] = useState(true);
  const [rotateLock, setRotateLock] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { marginBottom: 8, marginTop: 20 }]}>계정 정보</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="내 프로필"
          type="navigation"
          onPress={() => navigation.navigate('Profile')}
        />
        <SettingItem
          label="지난 여행 관리"
          type="navigation"
          onPress={() => navigation.navigate('PastTrip')}
        />

        <Text style={styles.sectionTitle}>알림</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="D-day 알림"
          type="toggle"
          value={dDayAlarm}
          onToggle={() => setDdayAlarm(!dDayAlarm)}
        />
        <SettingItem
          label="공지/업데이트 알림"
          type="toggle"
          value={updateAlarm}
          onToggle={() => setUpdateAlarm(!updateAlarm)}
        />
        <SettingItem
          label="야간 광고성 알림"
          type="toggle"
          value={adAlarm}
          onToggle={() => setAdAlarm(!adAlarm)}
        />

        <Text style={styles.sectionTitle}>서비스</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="GPS 사용 동의"
          type="toggle"
          value={gpsAgree}
          onToggle={() => setGpsAgree(!gpsAgree)}
        />
        <SettingItem
          label="지도 회전 방지"
          type="toggle"
          value={rotateLock}
          onToggle={() => setRotateLock(!rotateLock)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    color: colors.grayscale[1000],
    marginTop: 40,
    marginBottom: 8,
    fontFamily: 'Pretendard-SemiBold',
    paddingLeft: 5,
  },

  sectionDivider: {
    height: 2,
    backgroundColor: colors.grayscale[400],
    marginTop: 3,
  },
});
