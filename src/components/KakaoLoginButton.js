import { Pressable, StyleSheet } from 'react-native';
import KakaoLogin from '../../assets/ComponentsImage/KakaoLogin.svg';
import PropTypes from 'prop-types';

function KakaoLoginButton({ style, onPress }) {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <KakaoLogin />
    </Pressable>
  );
}

KakaoLoginButton.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KakaoLoginButton;
