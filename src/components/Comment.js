import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import PropTypes from 'prop-types';

function Comment({ count }) {
  return (
    <View style={styles.container}>
      <Ionicons name="chatbubble-ellipses-outline" size={15} color="black" />
      <Text style={styles.text}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginLeft: 6,
  },
});

export default Comment;
