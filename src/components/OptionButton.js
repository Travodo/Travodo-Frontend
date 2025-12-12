import { View, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

function OptionButton({ size, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <AntDesign name="menu" size={size} color="black" />
      </Pressable>
    </View>
  );
}

export default OptionButton;
