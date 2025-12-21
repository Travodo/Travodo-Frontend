import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import CheckCircleoff from '../../assets/ComponentsImage/CheckCircle_off.svg';
import CheckCircleon from '../../assets/ComponentsImage/CheckCircle_on.svg';
import PropTypes from 'prop-types';

function Checkbox({ size }) {
  const [isChecked, setIsChecked] = useState(false);

  function Checkpress() {
    setIsChecked(!isChecked);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={Checkpress}>
        {isChecked ? (
          <CheckCircleon width={size} height={size} />
        ) : (
          <CheckCircleoff width={size} height={size} />
        )}
      </Pressable>
    </View>
  );
}

Checkbox.propTypes = {
  size: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 50,
    height: 50,
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default Checkbox;
