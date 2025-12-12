import { View, Pressable } from 'react-native';
import Scrap from '../../assets/ComponentsImage/Scrap.svg';

function HeaderScrap({ onPress, size, style }) {
  return (
    <Pressable style={style} onPress={onPress}>
      <Scrap width={size} height={size} />
    </Pressable>
  );
}

export default HeaderScrap;
