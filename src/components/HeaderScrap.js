import { View, Pressable } from 'react-native';
import Scrap from '../../assets/ComponentsImage/Scrap.svg';
import PropTypes from 'prop-types';

function HeaderScrap({ onPress, size, style }) {
  return (
    <Pressable style={style} onPress={onPress}>
      <Scrap width={size} height={size} />
    </Pressable>
  );
}

HeaderScrap.propTypes = {
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
};

export default HeaderScrap;
