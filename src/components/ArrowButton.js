import { View, StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';

function ArrowButton({ onPress, rotateDeg }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, { transform: [{ rotate: `${rotateDeg}deg` }] }]}
        onPress={onPress}
      />
    </View>
  );
}

ArrowButton.propTypes = {
  onPress: PropTypes.func,
  rotateDeg: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    width: 8,
    height: 8,
    borderColor: colors.grayscale[1000],
  },
});

export default ArrowButton;
