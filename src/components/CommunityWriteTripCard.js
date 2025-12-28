import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { colors } from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

function CommunityWriteTripCard({ data }) {
  if (!data) return null;
  const { tripTitle, startDate, endDate, location, companions, circleColor, todo } = data;
  const displayTodo = typeof todo === 'object' ? '세부 일정 있음' : todo || '없음';

  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const companionCount = companions ? companions.length : 0;

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height !== contentHeight) {
      setContentHeight(height);
    }
  };

  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 180,
      useNativeDriver: false,
      isInteraction: true,
    }).start();
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.card,
          {
            opacity: pressed ? 0.8 : 1,
            borderBottomLeftRadius: expanded ? 0 : 20,
            borderBottomRightRadius: expanded ? 0 : 20,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={[styles.circle, { backgroundColor: circleColor || colors.primary[700] }]} />
          <Text style={styles.title} numberOfLines={1}>
            {tripTitle}
          </Text>
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
      </Pressable>
      <Animated.View
        style={[
          styles.detailBox,
          {
            height: heightInterpolate,
            opacity: opacityInterpolate,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: 0,
          },
        ]}
      >
        <View style={styles.detailInner} onLayout={onLayout}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>여행지</Text>
            <Text style={styles.detailValue}>{location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>여행 기간</Text>
            <Text style={styles.detailValue}>
              {startDate} ~ {endDate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>동행인원</Text>
            <Text style={styles.detailValue}>{companionCount}</Text>
          </View>
          <View style={styles.lastDetailRow}>
            <Text style={styles.detailLabel}>TODO</Text>
            <Text style={styles.detailValue}>{todo}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

CommunityWriteTripCard.propTypes = {
  data: PropTypes.shape({
    tripTitle: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    location: PropTypes.string,
    companions: PropTypes.array,
    circleColor: PropTypes.string,
    todo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 5,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: colors.grayscale[200],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 23,
    paddingHorizontal: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  circle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    flex: 1,
  },
  arrowIcon: {
    marginRight: 0,
  },
  date: {
    fontSize: 12,
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-Regular',
  },
  detailBox: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.grayscale[100],
  },
  detailInner: {
    paddingHorizontal: 20,
    paddingVertical: 27.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lastDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[900],
    fontSize: 14,
    minWidth: 70,
  },
  detailValue: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: colors.grayscale[800],
    flex: 1,
  },
});

export default CommunityWriteTripCard;
