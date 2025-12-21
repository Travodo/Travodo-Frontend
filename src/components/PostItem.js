import { View, Pressable, Text, StyleSheet } from 'react-native';
import Heart from './Heart';
import Comment from './Comment';
import ProfilePicture from '../../assets/ComponentsImage/ProfilePicture.svg';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function PostItem({ post, onPress, onScrap }) {
  const { nickname, agoDate, title, content, hCount, cCount, isScraped } = post;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.contents}>
          <View style={styles.profile}>
            <ProfilePicture size={25} />
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.days}>{agoDate}</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View>
            <Text style={styles.content}>{content}</Text>
          </View>
          <View style={styles.button}>
            <Heart count={hCount} onPress={onScrap} isScraped={isScraped} />
            <Comment count={cCount} />
          </View>
        </View>
        <View style={styles.picture} />
      </View>
    </Pressable>
  );
}

PostItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  nickname: PropTypes.string.isRequired,
  agoDate: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  hcount: PropTypes.string.isRequired,
  ccount: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 18.5,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    flexDirection: 'row',
  },
  contents: {
    gap: 12,
    width: 200,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    marginLeft: 8,
  },
  days: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: colors.grayscale[900],
    marginLeft: 'auto',
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
  content: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
  },
  button: {
    flexDirection: 'row',
    gap: 16,
  },
  picture: {
    width: 100,
    height: 100,
    backgroundColor: colors.grayscale[300],
    borderRadius: 12,
    marginLeft: 'auto',
    marginRight: 20,
    marginVertical: 'auto',
  },
});

export default PostItem;
