import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function TripCard({ trip }) {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const dDay = calculateDDay(trip.startDate);

  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderDDay = () => {
    if (dDay !== null && dDay !== undefined) {
      if (dDay === 0) {
        return <Text style={styles.dDay}>오늘!</Text>;
      } else if (dDay > 0) {
        return <Text style={styles.dDay}>D-{dDay}</Text>;
      } else {
        return <Text style={styles.dDay}>D+{Math.abs(dDay)}</Text>;
      }
    }
    return null;
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggleExpand}
        style={[styles.card, { borderLeftColor: trip.color }]}
      >
        <View style={styles.headerRow}>
          <View style={[styles.circle, { backgroundColor: trip.color }]} />
          <Text style={styles.title}>{trip.title}</Text>
          {renderDDay()}
          <MaterialIcons
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={26}
            color={colors.grayscale[900]}
          />
        </View>

        <Text style={styles.date}>
          {trip.startDate} - {trip.endDate}
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
        <View style={styles.detailInner}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>여행지 </Text>
            <Text style={styles.detailValue}>{trip.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>여행 기간 </Text>
            <Text style={styles.detailValue}>
              {trip.startDate} - {trip.endDate}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>여행명 </Text>
            <Text style={styles.detailValue}>{trip.title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>동행자 </Text>
            <Text style={styles.detailValue}>{trip.companions.join(', ')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareText}>공유하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.disabledButton}>
              <Text style={styles.disabledText}>자세히 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
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
    justifyContent: 'space-between',
    paddingBottom: 8,
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 10,
    marginRight: 3,
  },

  title: {
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    flex: 1,
    marginLeft: 6,
  },

  dDay: {
    fontSize: 16,
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 10,
  },

  date: {
    fontSize: 14,
    color: colors.grayscale[700],
    fontFamily: 'Pretendard-Medium',
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
    marginBottom: 20,
  },

  detailLabel: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    fontSize: 14,
    marginRight: 10,
    minWidth: 60,
  },

  detailText: {
    marginBottom: 20,
    fontFamily: 'Pretendard-Medium',
    color: colors.grayscale[600],
  },

  divider: {
    height: 1,
    backgroundColor: colors.grayscale[300],
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
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 24,
    marginRight: 10,
    marginLeft: 10,
  },

  shareText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
  },

  disabledButton: {
    backgroundColor: colors.grayscale[400],
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    borderRadius: 24,
    marginRight: 5,
  },

  disabledText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
  },
});
