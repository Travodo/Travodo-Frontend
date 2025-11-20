import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import CustomText from './components/CustomText';

function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/Fonts/Pretendard-Regular.otf'),
    'Pretendard-Bold': require('../assets/Fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/Fonts/Pretendard-SemiBold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CustomText>세상에 이런 폰트가 나오다니 천재인듯</CustomText>
      <CustomText SemiBold>세상에 이런 폰트가 나오다니 천재인듯</CustomText>
      <CustomText Medium>세상에 이런 폰트가 나오다니 천재인듯</CustomText>
      <Text>세상에 이런 폰트가 나오다니 천재인듯</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'blue',
  },
});

export default App;
