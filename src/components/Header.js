import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

export default function Header({
    text,
    showLeftArrow = true,
    showRightArrow = true,
    onPrev,
    onNext
}) {
    return (
        <View style={styles.container}>
            {showLeftArrow ? (
                <TouchableOpacity onPress={onPrev} hitSlop={10}>
                    <MaterialIcons name="chevron-left" size={26} color={colors.grayscale[1000]} />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 26 }} />
            )}
            <Text style={styles.text}>{text}</Text>

            {showRightArrow ? (
                <TouchableOpacity onPress={onNext} hitSlop={10}>
                    <MaterialIcons name="chevron-right" size={26} color={colors.grayscale[1000]} />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 26 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.grayscale[100],
        borderBottomWidth: 0.5,
        borderBottomColor: colors.grayscale[300]
    },

    text: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.grayscale[1000],
        fontFamily: 'Pretendard-SemiBold'
    },

});