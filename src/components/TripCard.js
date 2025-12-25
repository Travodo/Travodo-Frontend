import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const calculateDDay = (startDateString) => {
  if (!startDateString) return null;

  const dateParts = startDateString.match(/\d+/g);
  if (!dateParts || dateParts.length < 3) {
    console.error('날짜 형식이 올바르지 않습니다:', startDateString);
    return null;
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  const startDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const timeDiff = startDate.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (isNaN(dayDiff)) {
    console.error('날짜 계산 중 오류 발생 (NaN)', startDateString);
    return null;
  }

  return dayDiff;
};

export default function TripCard({ trip, hideActions = false }) {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const startDate = trip?.startDate;
  const endDate = trip?.endDate;
  const tripName = trip?.name ?? trip?.title ?? trip?.tripTitle ?? '여행';
  const destination = trip?.destination ?? trip?.place ?? trip?.location ?? '';
  const companions = Array.isArray(trip?.companions) ? trip.companions : [];
  const dDay = calculateDDay(startDate);
  const myStatus = trip?.status ?? (dDay != null && dDay <= 0 ? 'ONGOING' : 'UPCOMING');

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height !== contentHeight) {
      setContentHeight(height);
    }
  };

  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 240,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderDDay = () => {
    if (dDay === null) return null;

    let dDayText;
    if (dDay > 0) dDayText = `D-${dDay}`;
    else if (dDay === 0) dDayText = '오늘!';
    else dDayText = `D+${Math.abs(dDay)}`;

    const dDayStyle = dDay > 0 ? styles.dDay : styles.dDayPassed;
    return <Text style={dDayStyle}>{dDayText}</Text>;
  };

  const navigateTrip = () => {
    const state = navigation.getState?.();
    const routeNames = Array.isArray(state?.routeNames) ? state.routeNames : [];
    const canDirect = (screenName) => routeNames.includes(screenName);

    if (myStatus === 'ONGOING') {
      // TripCard가 TripStack 내부/외부 어디서 쓰이든 동작하도록 분기
      if (canDirect('OnTripScreen')) {
        navigation.navigate('OnTripScreen', { trip });
      } else {
      navigation.navigate('TripStack', { screen: 'OnTripScreen', params: { trip } });
      }
      return;
    }
    if (canDirect('Prepare')) {
      navigation.navigate('Prepare', { tripData: trip });
    } else {
    navigation.navigate('TripStack', { screen: 'Prepare', params: { tripData: trip } });
    }
  };

  const navigateToCommunityWrite = (tripData) => {
    // TripCard는 여러 네비게이터(TripStack/HomeStack 등)에서 재사용되므로
    // CommunityStack을 핸들하는 상위 네비게이터를 찾아서 이동
    let nav = navigation;
    for (let i = 0; i < 6 && nav; i += 1) {
      const state = nav.getState?.();
      const routeNames = Array.isArray(state?.routeNames) ? state.routeNames : [];

      // 이미 CommunityStack 내부에 있는 경우
      if (routeNames.includes('CommunityWrite')) {
        nav.navigate('CommunityWrite', { tripData });
        return;
      }

      // MainStack 등에서 CommunityStack을 직접 핸들할 수 있는 경우
      if (routeNames.includes('CommunityStack')) {
        nav.navigate('CommunityStack', { screen: 'CommunityWrite', params: { tripData } });
        return;
      }

      nav = nav.getParent?.();
    }

    // 최후의 fallback (개발 중 경고만 남기고 실패할 수 있음)
    navigation.navigate('CommunityStack', { screen: 'CommunityWrite', params: { tripData } });
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.wrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={toggleExpand}
          style={[styles.card, { borderLeftColor: trip.color || colors.primary[700] }]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.circle, { backgroundColor: trip.color || colors.primary[700] }]} />
            <Text style={styles.name}>{tripName}</Text>
            {renderDDay()}
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.grayscale[900]}
              style={styles.expendIcon}
            />
          </View>
          <Text style={styles.date}>
            {startDate} - {endDate}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.detailBox,
            {
              height: heightInterpolate,
              opacity: opacityInterpolate,
            },
          ]}
        >
          <View style={styles.detailInner} onLayout={onLayout}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>여행지</Text>
              <Text style={styles.detailValue}>{destination}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>여행 기간</Text>
              <Text style={styles.detailValue}>
                {startDate} ~ {endDate}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>여행명</Text>
              <Text style={styles.detailValue}>{tripName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>동행자</Text>
              <Text style={styles.detailValue}>
                {companions.length > 0
                  ? companions.join(', ')
                  : '동행자 없음'}
              </Text>
            </View>
            <View style={styles.divider} />

            {!hideActions && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => {
                    navigateToCommunityWrite({
                          // CommunityWriteTripCard가 기대하는 형태
                          id: trip?.id,
                          tripId: trip?.id,
                          tripTitle: tripName,
                          location: destination,
                          startDate,
                          endDate,
                          companions,
                          circleColor: trip?.color,
                    });
                  }}
                >
                  <Text style={styles.shareText}>공유하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.disabledButton} onPress={() => navigateTrip()}>
                  <Text style={styles.disabledText}>자세히 보기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 5,
  },

  card: {
    backgroundColor: colors.grayscale[200],
    borderRadius: 14,
    borderLeftWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: colors.grayscale[700],
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingTop: 2,
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 10,
    marginRight: 3,
  },

  name: {
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    flex: 1,
    marginLeft: 6,
  },

  dDay: {
    fontSize: 13,
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    borderRadius: 6,
    backgroundColor: colors.grayscale[200],
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 6,
  },

  dDayPassed: {
    fontSize: 15,
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-SemiBold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 10,
    backgroundColor: colors.grayscale[200],
  },

  date: {
    marginTop: 0,
    marginBottom: 5,
    fontSize: 13,
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-Regular',
  },

  detailBox: {
    overflow: 'hidden',
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: colors.grayscale[100],
  },

  detailInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  detailLabel: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    fontSize: 15,
    minWidth: 60,
    marginRight: 10,
  },

  detailValue: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: colors.grayscale[800],
  },

  divider: {
    height: 1,
    backgroundColor: colors.grayscale[400],
    marginVertical: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 12,
  },

  shareButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 22,
    marginRight: 4,
    marginLeft: 5,
  },

  shareText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
  },

  disabledButton: {
    backgroundColor: colors.grayscale[400],
    paddingVertical: 16,
    paddingHorizontal: 22,
    marginHorizontal: 22,
    borderRadius: 22,
    marginRight: 4,
  },

  disabledText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
  },
});
