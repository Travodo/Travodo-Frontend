import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

const Maps = () => {
  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.5665,
          longitude: 126.978,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}
      ></MapView>
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
