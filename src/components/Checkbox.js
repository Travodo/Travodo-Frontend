import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import CheckCircleoff from '../../assets/ComponentsImage/CheckCircle_off.svg';
import CheckCircleon from '../../assets/ComponentsImage/CheckCircle_on.svg';
import PropTypes from 'prop-types';

function Checkbox({ size, checked, onPress }) {
  // 기존 구현은 내부 state만 사용했는데, 공동 준비물 공유를 위해 controlled도 지원
  const [innerChecked, setInnerChecked] = useState(false);
  const isControlled = typeof checked === 'boolean';
  const isChecked = useMemo(() => (isControlled ? checked : innerChecked), [isControlled, checked, innerChecked]);

  function Checkpress() {
    if (!isControlled) setInnerChecked((prev) => !prev);
    onPress?.();
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
  checked: PropTypes.bool,
  onPress: PropTypes.func,
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
