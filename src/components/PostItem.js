import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import Heart from './Heart';
import Comment from './Comment';
import ProfileImage from './ProfileImage';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

function PostItem({ post, onPress, onScrap }) {
  const {
    nickname,
    agoDate,
    title,
    content,
    hCount,
    cCount,
    isScraped,
    images,
    imageUrl,
    profileImage,
  } = post;

  const thumbnailUri = images && images.length > 0 ? images[0] : imageUrl;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.contents}>
          <View style={styles.profile}>
            <ProfileImage size={25} imageUri={profileImage} />
            <Text style={styles.nickname}>{nickname}</Text>
            <Text style={styles.days}>{agoDate}</Text>
          </View>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <View>
            <Text style={styles.content} numberOfLines={2}>
              {content}
            </Text>
          </View>
          <View style={styles.button}>
            <Heart count={hCount || 0} onPress={onScrap} isScraped={isScraped} />
            <Comment count={cCount || 0} />
          </View>
        </View>

        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.picture} resizeMode="cover" />
        ) : (
          <View style={styles.picture} />
        )}
      </View>
    </Pressable>
  );
}

PostItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  onScrap: PropTypes.func,
  post: PropTypes.shape({
    nickname: PropTypes.string,
    agoDate: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    hCount: PropTypes.number,
    cCount: PropTypes.number,
    isScraped: PropTypes.bool,
    images: PropTypes.array,
    imageUrl: PropTypes.string,
    profileImage: PropTypes.string,
  }).isRequired,
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
