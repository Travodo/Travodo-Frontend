import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

export default function FAB({
  icon = 'add',
  onCreatePress,
  onJoinPress,
  size = 56,
  borderRadius = 28,
  bottom = 20,
  right = 20,
  backgroundColor = colors.primary[700],
  iconColor = colors.grayscale[100],
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [toggled, setToggled] = useState(false);

  const handlePress = () => {
    Animated.timing(rotation, {
      toValue: toggled ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setToggled(!toggled);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '315deg'],
  });

  const createY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const joinY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -13],
  });

  const opacityAnim = rotation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={[styles.wrapper, { bottom, right }]}>
      <Animated.View
        pointerEvents={toggled ? 'auto' : 'none'}
        style={[
          styles.subButttonWrapper,
          { transform: [{ translateY: createY }], opacity: opacityAnim },
        ]}
      >
        <TouchableOpacity style={styles.subButton} onPress={onCreatePress}>
          <Text style={styles.subText}>여행 생성</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        pointerEvents={toggled ? 'auto' : 'none'}
        style={[
          styles.subButttonWrapper,
          { transform: [{ translateY: joinY }], opacity: opacityAnim },
        ]}
      >
        <TouchableOpacity style={styles.subButton} onPress={onJoinPress}>
          <Text style={styles.subText}>여행 참가</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={[styles.container, { width: size, height: size, borderRadius, backgroundColor }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[animatedStyle, styles.iconWrapper]}>
          <MaterialIcons name={icon} size={28} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

FAB.propTypes = {
  icon: PropTypes.string,
  onCreatePress: PropTypes.func,
  onJoinPress: PropTypes.func,
  size: PropTypes.number,
  borderRadius: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number,
  backgroundColor: PropTypes.string,
  iconColor: PropTypes.string,
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: 30,
    width: 250,
  },

  iconWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.grayscale[1000],
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },

  subButtonWrapper: {
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: -1,
  },

  subButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayscale[100],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 17,
    minWidth: 70,
    marginBottom: 5,
    elevation: 4,
    shadowColor: colors.grayscale[1000],
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  subText: {
    color: colors.grayscale[800],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
});
