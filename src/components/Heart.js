import { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';

function Heart({ style, count }) {
  const [isChecked, setIsChecked] = useState(false);

  function Checkpress() {
    setIsChecked(!isChecked);
  }

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={Checkpress}>
        {isChecked ? (
          <FontAwesome name="heart" size={15} color="#E7211E" />
        ) : (
          <FontAwesome name="heart-o" size={15} color="black" />
        )}
      </Pressable>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
}

Heart.propTypes = {
  style: PropTypes.object,
  count: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: colors.grayscale[1000],
    marginLeft: 6,
  },
});

export default Heart;
