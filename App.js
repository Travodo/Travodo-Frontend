import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./src/screens/Onboarding/OnboardingScreen";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        PretendardBold: require("./assets/Fonts/Pretendard-Bold.otf"),
        PretendardSemiBold: require("./assets/Fonts/Pretendard-SemiBold.otf"),
        PretendardRegular: require("./assets/Fonts/Pretendard-Regular.otf"),
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFonts();
  }, []);

  useEffect(() => {
    const resetLaunch = async () => {
      await AsyncStorage.removeItem("launched");
    };
    resetLaunch();
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem("launched");
      if (value == null) {
        await AsyncStorage.setItem("launched", "true");
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (firstLaunch === null || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#769FFF" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontFamily: "PretendardSemiBold" }]}>
        Travodo 메인 화면
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: "#666", fontFamily: "PretendardRegular" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, color: "#22252C" },
});
