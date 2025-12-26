import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigation from './navigations/RootNavigation';

function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/Fonts/Pretendard-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigation />
      </AuthProvider>
      <Toast />
    </>
  );
}

export default App;
