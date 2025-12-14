import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function RootNavigation() {
    const isLoggedIn = true;

    return (
        <NavigationContainer>
            {isLoggedIn ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
}