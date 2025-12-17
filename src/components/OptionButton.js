import { View, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import PropTypes from 'prop-types';

function OptionButton({ size, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <AntDesign name="menu" size={size} color="black" />
      </Pressable>
    </View>
  );
}

OptionButton.propTypes = {
  size: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};
export default OptionButton;
