import { View, Text, StyleSheet } from 'react-native';
import ProfileImage from './ProfileImage';
import Heart from './Heart';
import DotButton from './DotButton';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function CommentItem({ nickname, date, comment, hcount, onLike, isLiked }) {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <ProfileImage size={25} />
        <View style={styles.info}>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.button}>
          <DotButton />
        </View>
      </View>
      <View>
        <Text style={styles.comment}>{comment}</Text>
      </View>
      <View>
        <Heart count={hcount} onPress={onLike} isScraped={isLiked} />
      </View>
    </View>
  );
}

CommentItem.propTypes = {
  nickname: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  hcount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLike: PropTypes.func.isRequired,
  isLiked: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.grayscale[400],
    paddingVertical: 12,
    gap: 12,
    width: '90%',
    alignSelf: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    right: 0,
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
