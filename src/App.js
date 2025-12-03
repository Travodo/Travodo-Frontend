import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Checkbox from "./components/Checkbox";
import ToggleSwitch from "./components/ToggleSwitch";
import Button from "./components/Button";
import TextField from "./components/TextField";
import InputField from "./components/InputField";
import ArrowButton from "./components/ArrowButton";
import ListItem from "./components/ListItem";
import OnboardingScreen from "../src/screens/onBoarding/OnboardingScreen";

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Checkbox size={50} />
      <ToggleSwitch onPress={() => console.log("click")} />
      <Button text={"로그인"} />
      <TextField placeholder={"로그인"} />
      <InputField placeholder={"인증번호"} />
      <ArrowButton rotateDeg={45} />
      <ListItem text={"asdasdasd"} />
      <ListItem text={"asdasdasd"} toggleDisable={true} />
      <ListItem text={"asdasdasd"} arrowDisable={true} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>홈</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Regular": require("../assets/Fonts/Pretendard-Regular.otf"),
    "Pretendard-Bold": require("../assets/Fonts/Pretendard-Bold.otf"),
    "Pretendard-SemiBold": require("../assets/Fonts/Pretendard-SemiBold.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "홈",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    color: "blue",
  },
});
