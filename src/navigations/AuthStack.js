import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="OnBoarding">
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
