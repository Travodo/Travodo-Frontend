import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingItem from '../../components/SettingItem';
import { colors } from '../../styles/colors';

function SettingsScreen({ navigation }) {
  const [dDayAlarm, setDdayAlarm] = useState(true);
  const [updateAlarm, setUpdateAlarm] = useState(false);
  const [adAlarm, setAdAlarm] = useState(false);
  const [gpsAgree, setGpsAgree] = useState(true);
  const [rotateLock, setRotateLock] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} bounces={false} overScrollMode="never">
        <Text style={[styles.sectionTitle, { marginBottom: 8, marginTop: 20 }]}>계정 정보</Text>
        <View style={styles.sectionDivider} />
        <SettingItem
          label="내 프로필"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'ProfileScreen' })}
        />
        <SettingItem
          label="지난 여행 관리"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'LasttripScreen' })}
        />
        <SettingItem
          label="내가 쓴 글"
          type="navigation"
          onPress={() => navigation.navigate('MyPageStack', { screen: 'MyWriteTrip' })}
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
    </View>
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
