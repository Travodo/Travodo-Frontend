import { Image, View, StyleSheet } from 'react-native';

function ProfileImage() {
  return (
    <View>
      <Image source={require('../../assets/ComponentsImage/ProfilePicture.svg')} />
    </View>
  );
}

export default ProfileImage;
