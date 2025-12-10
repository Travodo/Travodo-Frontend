import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/colors";
import Button from "../components/Button";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

export default function FindIdScreen({ navigation }) {
    const [email, setEmail] = useState("");

    const handleNext = () => {
        console.log("인증 메일 발송: ", email);
        navigation.navigate("VerifyEmail", {email});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>아이디 찾기</Text>
            <Text style={styles.subText}>이메일을 입력해 주세요.</Text>

            <TextInput style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" />

            <Button text="다음"
            onPress={handleNext}
            disable={!email}
            style={styles.button} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
    flex: 1, padding: normalize(24), backgroundColor: colors.grayscale[100], },
    title: { fontSize: normalize(20), fontFamily: 'Pretendard-Bold', marginBottom: normalize(8) },
    subText: { color: colors.grayscale[800], marginBottom: normalize(20) },
    
    input: {
        borderWidth: 1,
        borderColor: colors.grayscale[400],
        borderRadius: normalize(10),
        padding: normalize(12),
        marginBottom: 20,
    },

    button: {
        alignItems: "flex-end",
        marginTop: normalize(30),
    },
});