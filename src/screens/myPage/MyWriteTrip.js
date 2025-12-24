import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import PostList from '../../components/PostList';
import { colors } from '../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import { getMyPosts } from '../../services/api';

function MyWriteTrip({ navigation }) {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
  navigation.setOptions({
    headerShown: true,

    headerTitle: () => (
      <Text style={styles.headerTitle}>내가 쓴 글</Text>
    ),

    headerLeft: () => (
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ paddingLeft: 16 }}
        hitSlop={10}
      >
        <Text style={styles.headerSideText}>취소</Text>
      </Pressable>
    ),

    headerRight: () => (
      <Pressable
        onPress={() => {
          console.log('삭제');
        }}
        style={{ paddingRight: 16 }}
        hitSlop={10}
      >
        <Text style={[styles.headerSideText, { color: colors.primary[700] }]}>
          삭제
        </Text>
      </Pressable>
    ),
  });
}, [navigation]);


  useFocusEffect(
    useCallback(() => {
      fetchMyPosts();
    }, []),
  );

  const fetchMyPosts = async () => {
    try {
      const res = await getMyPosts({ page: 0, size: 50 }); // PostListResponse
      // PostList 컴포넌트가 기대하는 형태로 최소 변환
      const content = res?.content || [];
      const mapped = content.map((p) => ({
        id: p.id,
        nickname: p.author?.nickname || '',
        title: p.title,
        content: p.summary || p.content || '',
        hCount: p.likeCount ?? 0,
        cCount: p.commentCount ?? 0,
        isScrap: p.isBookmarked ?? false,
        agoDate: p.createdAt ? String(p.createdAt) : '',
        images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
        // trip 정보(선택)
        tripTitle: p.trip?.name,
        startDate: p.trip?.startDate ? String(p.trip.startDate).replace(/-/g, '.') : undefined,
        endDate: p.trip?.endDate ? String(p.trip.endDate).replace(/-/g, '.') : undefined,
        location: p.trip?.place,
        people: p.trip?.memberCount,
        todo: '',
        circleColor: p.trip?.color,
      }));
      setMyPosts(mapped);
    } catch (error) {
      console.error('내 글 조회 실패:', error);
      setMyPosts([]);
    }
  };

  const handleUnScrap = async (postId) => {
    try {
      // TODO: 서버 북마크 API로 교체 필요 (현재는 UI 반영만)
      setMyPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isScrap: !p.isScrap } : p)),
      );
    } catch (error) {
      console.error('스크랩 요청 실패:', error);
    }
  };
  return (
    <View style={styles.container}>
      {myPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 작성한 글이 없어요.</Text>
        </View>
      ) : (
        <PostList
          data={myPosts}
          onScrap={handleUnScrap}
          onPress={(item) => {
            navigation.navigate('CommunityStack', {
              screen: 'CommunityContent',
              params: { post: item },
            });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: colors.grayscale[500],
  },
  headerTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.grayscale[900],
  },

  headerSideText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.grayscale[700],
  },
});

export default MyWriteTrip;
