import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ProfilePicture from '../../assets/ComponentsImage/ProfilePicture.svg';

function ProfileImage({ size, imageUri }) {
  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <ProfilePicture width={size} height={size} />
    </View>
  );
}

ProfileImage.propTypes = {
  size: PropTypes.number.isRequired,
  imageUri: PropTypes.string,
};

export default ProfileImage;
