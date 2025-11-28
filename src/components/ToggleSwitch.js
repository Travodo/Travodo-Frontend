import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { colors } from '../styles/colors';

function ToggleSwitch() {
  const [isToggled, setIsToggled] = useState(false);
  const toggleAnim = useRef(new Animated.Value(0)).current;

  function Togglepress() {
    const toValue = isToggled ? 0 : 1;

    Animated.timing(toggleAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsToggled(!isToggled);
  }
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
      <Pressable onPress={Togglepress}>
        <Animated.View style={[styles.togglebackground, { backgroundColor }]}>
          <Animated.View style={[styles.circle, { transform: [{ translateX: circlePosition }] }]} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

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
