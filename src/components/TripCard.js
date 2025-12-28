import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { getCurrentTrip } from '../services/api';

const calculateDDay = (startDateString) => {
  if (!startDateString) return null;

  const dateParts = startDateString.match(/\d+/g);
  if (!dateParts || dateParts.length < 3) return null;

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  const startDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diff = startDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function TripCard({ trip, hideActions = false }) {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;

  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [ongoingTrip, setOngoingTrip] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const data = await getCurrentTrip();
          setOngoingTrip(data?.id ? data : null);
        } catch {
          setOngoingTrip(null);
        }
      })();
    }, []),
  );

  const isOngoingInApi =
    ongoingTrip && String(ongoingTrip.id) === String(trip?.id);

  const targetTripData = isOngoingInApi
    ? {
        ...ongoingTrip,
        name:
          ongoingTrip?.name ??
          ongoingTrip?.title ??
          trip?.name ??
          trip?.title ??
          trip?.tripTitle,
        destination:
          ongoingTrip?.destination ??
          trip?.destination ??
          trip?.place ??
          trip?.location,
        companions: ongoingTrip?.companions ?? trip?.companions,
        color: ongoingTrip?.color ?? trip?.color,
      }
    : trip;

  const startDate = targetTripData?.startDate;
  const endDate = targetTripData?.endDate;
  const tripName =
    targetTripData?.name ??
    targetTripData?.title ??
    targetTripData?.tripTitle ??
    '여행';
  const destination =
    targetTripData?.destination ??
    targetTripData?.place ??
    targetTripData?.location ??
    '';
  const companions = Array.isArray(targetTripData?.companions)
    ? targetTripData.companions
    : [];
  const dDay = calculateDDay(startDate);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
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
    if (dDay > 0) return <Text style={styles.dDay}>{`D-${dDay}`}</Text>;
    if (dDay === 0) return <Text style={styles.dDay}>오늘!</Text>;
    return <Text style={styles.dDayPassed}>{`D+${Math.abs(dDay)}`}</Text>;
  };

  const navigateTrip = () => {
    const status = isOngoingInApi ? 'ONGOING' : trip?.status || 'UPCOMING';

    if (status === 'ONGOING') {
      navigation.navigate('OnTrip', { trip: targetTripData });
    } else {
      navigation.navigate('Prepare', { tripData: targetTripData });
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.wrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={toggleExpand}
          style={[
            styles.card,
            { borderLeftColor: targetTripData?.color || colors.primary[700] },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.circle,
                { backgroundColor: targetTripData?.color || colors.primary[700] },
              ]}
            />
            <Text style={styles.name}>{tripName}</Text>
            {renderDDay()}
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.grayscale[900]}
            />
          </View>
          <Text style={styles.date}>
            {startDate} - {endDate}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.detailBox,
            { height: heightInterpolate, opacity: opacityInterpolate },
          ]}
        >
          <View
            style={styles.detailInner}
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          >
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
                {companions.length ? companions.join(', ') : '동행자 없음'}
              </Text>
            </View>

            {!hideActions && (
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={styles.shareButton}
      onPress={() => {
        navigation.navigate('CommunityStack', {
          screen: 'CommunityWrite',
          params: {
            tripData: {
              id: targetTripData?.id,
              tripTitle: tripName,
              location: destination,
              startDate,
              endDate,
              companions,
              circleColor: targetTripData?.color,
            },
          },
        });
      }}
    >
      <Text style={styles.shareText}>공유하기</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.disabledButton}
      onPress={navigateTrip}
    >
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
