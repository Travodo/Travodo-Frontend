import { Pressable, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

function DotButton({ onPress }) {
  return (
    <Pressable style={[styles.container, { transform: [{ rotate: `90deg` }] }]} onPress={onPress}>
      <Text style={styles.text}>. . .</Text>
    </Pressable>
  );
}

DotButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
});

export default DotButton;
