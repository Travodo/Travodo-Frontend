import { View, Pressable, StyleSheet, Text, Platform } from 'react-native';
import Camera from '../../assets/ComponentsImage/Camera.svg';

function CameraBottomBar({ onCameraPress, onMorePress }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onCameraPress}>
        <Camera width={18} height={15} />
      </Pressable>
      
      <Pressable
  style={{ alignItems: 'center', justifyContent: 'center' }}
  onPress={onMorePress}
>
  <Text style={styles.dotButton}>· · ·</Text>
</Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    paddingLeft: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 15,
    minHeight: 56,
    boxShadow: [
      {
        offsetX: 1,
        offsetY: 0,
        blurRadius: 8,
        spreadDistance: 1,
        color: '#00000014',
      },
    ],
  },
  dotButton: {
    alignItems: 'center',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
  },
});

export default CameraBottomBar;
