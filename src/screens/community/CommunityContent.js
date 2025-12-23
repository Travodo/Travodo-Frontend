import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Pressable,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommunityTripPlan from '../../components/CommunityTripPlan';
import ProfileImage from '../../components/ProfileImage';
import { colors } from '../../styles/colors';
import DotButton from '../../components/DotButton';
import Heart from '../../components/Heart';
import Comment from '../../components/Comment';
import CommentListItem from '../../components/CommentListItem';
import PropTypes from 'prop-types';
import CommentInput from '../../components/CommentInput';
import { CommunityData } from '../../data/TripList';
import Scrap from '../../../assets/ComponentsImage/Scrap.svg';
import Close from '../../../assets/ComponentsImage/Close.svg';
import Report from '../../../assets/ComponentsImage/Report.svg';

function CommunityContent({ route, navigation }) {
  const [commentList, setCommentList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrapCount, setScrapCount] = useState(post ? Number(post.hCount || 0) : 0);
  const [isScrap, setIsScrap] = useState(post?.isScrap || false);

  const { post: passedPost, postId } = route.params || {};
  const post = passedPost || CommunityData.find((p) => p.id.toString() === postId?.toString());
  if (!post) {
    return (
      <View style={styles.container}>
        <Text>게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          style={[styles.headerButton, { transform: [{ rotate: '-45deg' }] }]}
          onPress={() => navigation.goBack()}
        ></Pressable>
      ),
    });
  }, []);

  const {
    nickname,
    agoDate,
    title,
    content,
    images,
    cCount = 0,
    tripData,
    circleColor,
    tripTitle,
  } = post;

  const toDotDate = (d) => (d ? String(d).replace(/-/g, '.') : '');
  const normalizedTripData =
    tripData ||
    post?.tripData ||
    (post?.trip
      ? {
          tripId: post.trip?.id ?? post.tripId,
          tripTitle: post.trip?.name ?? '',
          startDate: toDotDate(post.trip?.startDate),
          endDate: toDotDate(post.trip?.endDate),
          location: post.trip?.place ?? '',
          people: Number(post.trip?.maxMembers ?? 0),
          todo: null,
          circleColor: post.trip?.color ?? '',
        }
      : post);

  const { startDate, endDate, location, people, todo } = normalizedTripData || {};
  const displayTripTitle = (normalizedTripData && normalizedTripData.tripTitle) || tripTitle || title;
  const displayCircleColor = (normalizedTripData && normalizedTripData.circleColor) || circleColor;

  const handleSendComment = () => {
    if (inputText.trim().length === 0) return;

    const newComment = {
      id: Date.now(),
      nickname: '히재',
      content: inputText,
      date: '방금 전',
      commentlike: 0,
      isLiked: false,
    };
    setCommentList((prev) => [...prev, newComment]);
    setInputText('');
    Keyboard.dismiss();
  };

  const handleScrap = () => {
    setIsScrap((prev) => !prev);
    setScrapCount((prev) => (isScrap ? prev - 1 : prev + 1));
  };

  const handleModalScrap = () => {
    handleScrap();
    setVisibleModal(false);
  };

  const handleCommentLike = (commentId) => {
    setCommentList((prevList) =>
      prevList.map((item) => {
        if (item.id === commentId) {
          const currentLiked = item.isLiked || false;
          return {
            ...item,
            isLiked: !currentLiked,
            commentlike: currentLiked ? (item.commentlike || 0) - 1 : (item.commentlike || 0) + 1,
          };
        }
        return item;
      }),
    );
  };

  const Container = Platform.OS === 'android' ? SafeAreaView : View;

  return (
    <Container
      style={styles.container}
      {...(Platform.OS === 'android' ? { edges: ['top', 'left', 'right', 'bottom'] } : {})}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} bounces={false} overScrollMode="never">
          <Pressable style={styles.dismiss}>
            <View style={styles.innerContainer}>
              <View style={styles.profileContainer}>
                <ProfileImage size={25} />
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.date}>{agoDate}</Text>
                <View style={styles.button}>
                  <DotButton onPress={() => setVisibleModal(true)} />
                </View>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.content}>{content}</Text>
              </View>
              <View style={styles.tripplan}>
                <CommunityTripPlan
                  circleColor={displayCircleColor}
                  title={displayTripTitle}
                  startDate={startDate || ''}
                  endDate={endDate || ''}
                  location={location || ''}
                  people={Number(people || 0)}
                  todo={todo || null}
                />
              </View>
              <View style={styles.imageContainer}>
                {images &&
                  images.length > 0 &&
                  images.map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      style={{ width: 160, height: 160, borderRadius: 12 }}
                    />
                  ))}
              </View>
              <View style={styles.heartncomment}>
                <Heart size={15} count={scrapCount} onPress={handleScrap} isScraped={isScrap} />
                <Comment size={15} count={String(Number(cCount) + commentList.length)} />
              </View>
              <CommentListItem data={commentList} onLike={handleCommentLike} />
            </View>
          </Pressable>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            setVisibleModal(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalbox}>
              <View style={styles.closeStyle}>
                <Pressable onPress={() => setVisibleModal(false)}>
                  <Close width={15} height={15} />
                </Pressable>
              </View>
              <Pressable style={styles.scrapContainer} onPress={handleModalScrap}>
                <Scrap width={24} height={23} />
                <Text style={styles.scrapText}>글 저장하기</Text>
              </Pressable>
              <Pressable style={styles.scrapContainer}>
                <Report width={24} height={23} />
                <Text style={styles.report}>신고하기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View style={styles.commentInput}>
          <CommentInput value={inputText} onChangeText={setInputText} onPress={handleSendComment} />
        </View>
      </View>
    </Container>
  );
}

CommunityContent.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  dismiss: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  innerContainer: {
    backgroundColor: '#fff',
    gap: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginLeft: 26,
    alignItems: 'center',
  },
  nickname: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: colors.grayscale[800],
  },
  button: {
    position: 'absolute',
    right: 26,
    backgroundColor: '#fff',
  },
  contentContainer: {
    marginHorizontal: 26,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
  },
  content: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
  tripplan: {
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  heartncomment: {
    flexDirection: 'row',
    gap: 35,
    marginHorizontal: 26,
  },
  headerRightContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    marginRight: 20,
  },
  commentInput: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  scroll: {
    paddingBottom: 90,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalbox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 46,
  },
  closeStyle: {
    paddingVertical: 20.5,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  scrapText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  scrapContainer: {
    flexDirection: 'row',
    gap: 20,
    paddingLeft: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    width: '100%',
    paddingVertical: 12.5,
  },
  report: {
    color: '#e71e25',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  headerButton: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#000',
    width: 13,
    height: 13,
    marginLeft: 15,
  },
});

export default CommunityContent;
