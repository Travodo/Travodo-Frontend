import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { colors } from "../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

export default function TripCard({ trip }) {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

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
    outputRange: [0, normalize(240)],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderDDay = () => {
    if (trip.dDay !== undefined && trip.dDay !== null) {
         return (
             <Text style={styles.dDay}>
                {trip.dDay === 0 ? '오늘!' : `D-${trip.dDay}`}
                 </Text>
                 ); }
                  return null; 
                 };

  return (
    <View style={styles.wrapper }>

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
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={normalize(26)}
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
            <Text style={styles.detailValue}>
              {trip.companions.join(", ")}
            </Text>
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
  wrapper: { marginTop: normalize(10), marginBottom: normalize(5) },

  card: {
    backgroundColor: colors.grayscale[200],
    borderRadius: normalize(14),
    borderLeftWidth: normalize(6),
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(18),
    shadowColor: colors.grayscale[700],
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  circle: {
    width: normalize(14),
    height: normalize(14),
    borderRadius: normalize(10),
    marginRight: normalize(3),
  },

  title: {
    fontSize: normalize(17),
    fontFamily: "Pretendard-SemiBold",
    color: colors.grayscale[900],
    flex: 1,
    marginLeft: normalize(6),
  },

  dDay: {
    fontSize: normalize(15),
    color: colors.primary[700],
    marginRight: normalize(10),
    fontFamily: 'Pretendard-SemiBold',
  },

  date: {
    marginTop: normalize(6),
    fontSize: normalize(13),
    color: colors.grayscale[700],
    fontFamily: "Pretendard-Medium",
  },

  detailBox: {
    overflow: "hidden",
    borderRadius: normalize(12),
    marginTop: normalize(6),
    backgroundColor: colors.grayscale[100],
  },

  detailInner: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16),
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20),
  },

  detailLabel: {
    fontFamily: "Pretendard-SemiBold",
    color: colors.grayscale[900],
    fontSize: normalize(14),
    minWidth: normalize(64),
    marginRight: normalize(10),
  },

  detailText: {
    marginBottom: normalize(20),
    fontFamily: "Pretendard-Medium",
    color: colors.grayscale[600],
  },

  divider: {
    height: 1,
    backgroundColor: colors.grayscale[300],
    marginTop: normalize(4),
    marginBottom: normalize(8),
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: normalize(7),
  },

  shareButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(24),
    marginRight: normalize(10),
    marginLeft: normalize(10),
  },

  shareText: {
    color: colors.grayscale[100],
    fontFamily: "Pretendard-SemiBold",
    fontSize: normalize(14),
  },

  disabledButton: {
    backgroundColor: colors.grayscale[400],
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(24),
    marginHorizontal: normalize(24),
    borderRadius: normalize(24),
    marginRight: normalize(5),
  },

  disabledText: {
    color: colors.grayscale[100],
    fontFamily: "Pretendard-SemiBold",
    fontSize: normalize(14),
  },
});