import { View, StyleSheet, Pressable } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function RadioButton({ checked }) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.border,
          checked ? { borderColor: colors.primary[700] } : { borderColor: colors.grayscale[400] },
        ]}
      >
        <View
          style={[
            styles.circle,
            checked
              ? { backgroundColor: colors.primary[700] }
              : { backgroundColor: colors.grayscale[400] },
          ]}
        />
      </View>
    </View>
  );
}

RadioButton.proptypes = {
  checked: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary[700],
    padding: 2,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary[700],
  },
});

export default RadioButton;
