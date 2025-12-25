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
  Alert,
  TextInput,
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
import Delete from '../../../assets/ComponentsImage/Delete.svg';
import { likeComment, unlikeComment } from '../../services/api.js';
import { updateComment, deleteComment } from '../../services/api.js';
import {
  getMyInfo,
  getCommunityPost,
  deleteCommunityPost,
  likeCommunityPost,
  unlikeCommunityPost,
  getPostComments,
  createPostComment,
  unbookmarkCommunityPost,
  bookmarkCommunityPost,
} from '../../services/api';
import { formatAgo } from '../../utils/dateFormatter';

function CommunityContent({ route, navigation }) {
  const { post: passedPost, postId: passedPostId } = route.params || {};
  const postId = passedPostId || passedPost?.id;
  const post = passedPost || CommunityData.find((p) => p.id.toString() === postId?.toString());

  const [commentList, setCommentList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrapCount, setScrapCount] = useState(Number(passedPost?.hCount || 0));
  const [isScrap, setIsScrap] = useState(passedPost?.isScraped || false);
  const [userId, setUserId] = useState('');
  const [writerId, setWriterId] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [postImages, setPostImages] = useState(passedPost?.images || []);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleSubmitEdit = async () => {
    if (!editText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요');
      return;
    }

    try {
      await updateComment(editingComment.id, { content: editText });

      setCommentList((prev) =>
        prev.map((c) =>
          c.id === editingComment.id ? { ...c, content: editText } : c,
        ),
      );

      setEditingComment(null);
      setEditText('');
    } catch (e) {
      Alert.alert('오류', '댓글 수정에 실패했습니다');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          style={[styles.headerButton, { transform: [{ rotate: '-45deg' }] }]}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, []);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const data = await getMyInfo();
        setUserId(data.id);
      } catch (error) {
        console.error('정보를 가져오는데 실패했습니다.', error);
      }
    };
    fetchId();
  }, []);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;
      try {
        const [postData, commentData] = await Promise.all([
          getCommunityPost(postId),
          getPostComments(postId, { page: 0, size: 50 }),
        ]);

        setWriterId(postData?.author?.id);
        setScrapCount(postData?.likeCount ?? 0);
        setIsScrap(postData?.isLiked ?? false);
        setProfileImg(postData?.author?.profileImageUrl || null);
        setPostImages(postData?.imageUrls || []);
        
        const rawComments = commentData?.content || commentData || [];
        const mappedComments = rawComments.map((c) => ({
          id: c.id,
          authorId: c.author?.id,
          nickname: c.author?.nickname || '익명',
          content: c.content,
          date: formatAgo(c.createdAt),
          commentlike: c.likeCount || 0,
          isLiked: c.isLiked || false,
          profileImageUrl: c.author?.profileImageUrl,
        }));

        setCommentList(mappedComments);
        // ---------------------------------------------------------
      } catch (error) {
        console.error('게시글 정보를 가져오는데 실패했습니다.', error);
      }
    };
    fetchPostDetail();
  }, [postId]);

  const isMyPost = userId !== null && userId !== '' && userId === writerId;

  const {
    nickname,
    agoDate,
    title,
    content,
    images: postImagesFromRoute,
    cCount = 0,
    tripData,
    circleColor,
    tripTitle,
  } = post;

  const images = postImages.length > 0 ? postImages : postImagesFromRoute || [];

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
  const displayTripTitle =
    (normalizedTripData && normalizedTripData.tripTitle) || tripTitle || title;
  const displayCircleColor = (normalizedTripData && normalizedTripData.circleColor) || circleColor;

  const handleSendComment = async () => {
    if (inputText.trim().length === 0) return;
    try {
      const res = await createPostComment(postId, { content: inputText });

      const newComment = {
        id: res.id,
        authorId: res.author?.id,
        nickname: res.author?.nickname || '익명',
        content: res.content,
        date: '방금 전',
        commentlike: 0,
        isLiked: false,
        profileImageUrl: res.author?.profileImageUrl,
      };

      setCommentList((prev) => [...prev, newComment]);
      setInputText('');
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('알림', '댓글 등록에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(commentId);
            setCommentList((prev) => prev.filter((c) => c.id !== commentId));
          } catch (e) {
            Alert.alert('오류', '댓글 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleScrap = async () => {
    const isCurrentlyLiked = isScrap;
    const nextScrapStatus = !isScrap;

    setIsScrap(nextScrapStatus);
    setScrapCount((prev) => (nextScrapStatus ? prev + 1 : prev - 1));

    try {
      if (isCurrentlyLiked) {
        await unlikeCommunityPost(postId);
        await unbookmarkCommunityPost(postId);
      } else {
        await likeCommunityPost(postId);
        await bookmarkCommunityPost(postId);
      }
    } catch (error) {
      setIsScrap(!nextScrapStatus);
      setScrapCount((prev) => (isCurrentlyLiked ? prev : prev));
      Alert.alert('알림', '처리에 실패했습니다.');
    }
  };

  const handleModalScrap = () => {
    handleScrap();
    setVisibleModal(false);
  };

  const handleDeletePost = () => {
    setVisibleModal(false);
    Alert.alert('게시글 삭제', '정말로 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityPost(postId);
            Alert.alert('완료', '게시글이 삭제되었습니다.');
            navigation.goBack();
          } catch (error) {
            console.error('삭제 실패', error);
            Alert.alert('오류', '게시글 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleCommentMore = (comment) => {
    if (comment.authorId !== userId) {
      Alert.alert('권한 없음', '내 댓글만 수정/삭제할 수 있습니다.');
      return;
    }

    Alert.alert('댓글 관리', null, [
      {
        text: '수정',
        onPress: () => {
          setEditingComment(comment);
          setEditText(comment.content);
        },
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => handleDeleteComment(comment.id),
      },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const handleCommentLike = async (commentId) => {
    const target = commentList.find((c) => c.id === commentId);
    if (!target) return;

    setCommentList((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              commentlike: c.isLiked
                ? (c.commentlike || 0) - 1
                : (c.commentlike || 0) + 1,
            }
          : c,
      ),
    );

    try {
      if (target.isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);

      setCommentList((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isLiked: target.isLiked,
                commentlike: target.commentlike,
              }
            : c,
        ),
      );

      Alert.alert('알림', '댓글 좋아요 처리에 실패했습니다.');
    }
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
                <ProfileImage size={25} imageUri={profileImg} />
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
                    <Image key={index} source={{ uri }} style={styles.image} />
                  ))}
              </View>
              <View style={styles.heartncomment}>
                <Heart size={15} count={scrapCount} onPress={handleScrap} isScraped={isScrap} />
                <Comment size={15} count={String(Number(cCount) + commentList.length)} />
              </View>
              
              <CommentListItem 
                data={commentList} 
                onLike={handleCommentLike}
                onMore={handleCommentMore}
                myUserId={userId}
              />
            </View>
          </Pressable>
        </ScrollView>

        <Modal
          transparent
          animationType="fade"
          visible={!!editingComment}
          onRequestClose={() => setEditingComment(null)}
        >
          <Pressable
            style={styles.editOverlay}
            onPress={() => setEditingComment(null)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.editModal}>
                <Text style={styles.editTitle}>댓글 수정</Text>

                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  multiline
                  autoFocus
                />

                <View style={styles.editActions}>
                  <Pressable onPress={() => setEditingComment(null)}>
                    <Text style={styles.cancelText}>취소</Text>
                  </Pressable>

                  <Pressable onPress={handleSubmitEdit}>
                    <Text style={styles.saveText}>저장</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => setVisibleModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalbox}>
              <View style={styles.closeStyle}>
                <Pressable
                  onPress={() => setVisibleModal(false)}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <Close width={15} height={15} />
                </Pressable>
              </View>
              <Pressable style={styles.scrapContainer} onPress={handleModalScrap}>
                <Scrap width={24} height={23} />
                <Text style={styles.scrapText}>글 저장하기</Text>
              </Pressable>
              {isMyPost ? (
                <Pressable style={styles.scrapContainer} onPress={handleDeletePost}>
                  <Delete width={24} height={23} />
                  <Text style={styles.deleteText}>삭제하기</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.scrapContainer}>
                  <Report width={24} height={23} />
                  <Text style={styles.report}>신고하기</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.commentInput}>
          <CommentInput 
            value={inputText} 
            onChangeText={setInputText} 
            onPress={handleSendComment} 
          />
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
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },

  editTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 12,
  },

  editInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.grayscale[300],
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Pretendard-Regular',
  },

  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 12,
  },

  cancelText: {
    color: colors.grayscale[600],
    fontFamily: 'Pretendard-Regular',
  },

  saveText: {
    color: colors.primary[700],
    fontFamily: 'Pretendard-SemiBold',
  },

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
    flexWrap: 'wrap',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
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
  deleteText: {
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