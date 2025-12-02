import React from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { colors } from "../styles/colors";
import PropTypes from "prop-types";

export default function FAB({ 
    icon = "add", 
    onPress,
    size=56,
    borderRadius=28,
    bottom=20,
    right=20, 
    backgroundColor=colors.primary[700], 
    iconColor=colors.grayscale[100]
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

        if (onPress) onPress();
    };

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0,1],
        outputRange: ["0deg", "315deg"]
    });

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
            <Animated.View style={animatedStyle}>
                <MaterialIcons name={icon} size={28} color={colors.grayscale[100]} />
            </Animated.View>
        </TouchableOpacity>
    );
}


FAB.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
  size: PropTypes.number,
  borderRadius: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number,
  backgroundColor: PropTypes.string,
  iconColor: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 10,
        right: 20,
        backgroundColor: colors.primary[700],
        borderRadius: 28,
        width: 56,
        height: 56,
        alignItems: "center",
        elevation: 6,
        shadowColor: colors.grayscale[1000],
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
        justifyContent: 'center'
    },
});