import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/ComponentsImage/ProfilePicture.svg';

function ProfileImage({ size }) {
  return (
    <View>
      <ProfilePicture width={size} height={size} />
    </View>
  );
}

ProfileImage.propTypes = {
  size: PropTypes.number.isRequired,
};

ProfileImage.propTypes = {
  size: PropTypes.number.isRequired,
};

export default ProfileImage;
