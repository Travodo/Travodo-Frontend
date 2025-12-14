import { Pressable, Text, StyleSheet } from 'react-native';

function DotButton({ onPress }) {
  return (
    <Pressable style={[styles.container, { transform: [{ rotate: `90deg` }] }]} onPress={onPress}>
      <Text style={styles.text}>. . .</Text>
    </Pressable>
  );
}

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
