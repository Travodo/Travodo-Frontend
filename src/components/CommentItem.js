import { View, Text, StyleSheet } from 'react-native';
import ProfileImage from './ProfileImage';
import Heart from './Heart';
import DotButtton from './DotButton';
import { colors } from '../styles/colors';

function CommentItem() {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <ProfileImage size={25} />
        <View style={styles.info}>
          <Text style={styles.nickname}>cjftn0729</Text>
          <Text style={styles.date}>2주 전</Text>
        </View>
        <View style={styles.button}>
          <DotButtton />
        </View>
      </View>
      <View>
        <Text style={styles.comment}>계획 공유 감사합니다!!</Text>
      </View>
      <View>
        <Heart count={67} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.grayscale[400],
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    marginLeft: 364,
  },
  info: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  nickname: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
  date: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: colors.grayscale[900],
  },
  comment: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
});

export default CommentItem;
