import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onBoarding/OnboardingScreen';
import SignInScreen from '../screens/sign/SignInScreen';
import SignUpScreen from '../screens/sign/SignUpScreen';
import ComunityHome from '../screens/ComunityHome';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="empty">
      <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="empty" component={ComunityHome} />
    </Stack.Navigator>
  );
};

export default AuthStack;
