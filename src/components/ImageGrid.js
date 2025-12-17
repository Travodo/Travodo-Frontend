import { Image, StyleSheet, View } from 'react-native';

const imagemap = {
  image1: require('../../assets/data/tripimage1.png'),
  image2: require('../../assets/data/tripimage2.png'),
};

function ImageGrid({ imageName }) {
  const imageSource = imagemap[imageName];

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 12,
  },
});

export default ImageGrid;
