import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import Checkbox from './components/Checkbox';
import ToggleSwitch from './components/ToggleSwitch';
import Button from './components/Button';
import TextField from './components/TextField';
import InputField from './components/InputField';
import ArrowButton from './components/ArrowButton';
import ListItem from './components/ListItem';

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
      <Checkbox size={50} />
      <ToggleSwitch onPress={() => console.log('click')} />
      <Button text={'로그인'} />
      <TextField placeholder={'로그인'} />
      <InputField placeholder={'인증번호'} />
      <ArrowButton rotateDeg={45} />
      <ListItem text={'asdasdasd'} />
      <ListItem text={'asdasdasd'} toggleDisable={true} />
      <ListItem text={'asdasdasd'} arrowDisable={true} />
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
