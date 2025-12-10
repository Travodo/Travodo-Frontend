import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/colors";
import Button from "../components/Button";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

export default function VerifyScreen({ route, navitation }) {
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(300);
    const { email } = route.params || {};

    useEffect(() => {
        
    })
}