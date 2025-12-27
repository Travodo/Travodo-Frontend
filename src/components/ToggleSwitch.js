import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function ToggleSwitch({ value, onValueChange }) {
  const toggleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const circlePosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 18],
  });

  const backgroundColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.grayscale[200], colors.primary[700]],
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (onValueChange) {
            onValueChange(!value);
          }
        }}
      >
        <Animated.View style={[styles.togglebackground, { backgroundColor }]}>
          <Animated.View style={[styles.circle, { transform: [{ translateX: circlePosition }] }]} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

ToggleSwitch.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglebackground: {
    height: 21,
    width: 36,
    borderRadius: 10.5,
    justifyContent: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 7.5,
  },
});

export default ToggleSwitch;
