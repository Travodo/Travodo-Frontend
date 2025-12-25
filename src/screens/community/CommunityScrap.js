import { View, StyleSheet, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import PostList from '../../components/PostList';
import { colors } from '../../styles/colors';
// API 함수 임포트 (unbookmark 함수 포함)
import {
  getBookmarkedPosts,
  unbookmarkCommunityPost,
  unlikeCommunityPost,
} from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function CommunityScrap({ navigation }) {
  const [scrapPosts, setScrapPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 헤더 설정 (뒤로가기 버튼)
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
  }, [navigation]);

  // 2. 화면 진입 시마다 북마크 목록 불러오기
  useFocusEffect(
    useCallback(() => {
      const loadScrapPosts = async () => {
        try {
          setLoading(true);
          const res = await getBookmarkedPosts({ page: 0, size: 50 });

          // 서버 응답 구조 분기 처리 (Page 객체 혹은 순수 배열)
          const content = res?.content || res || [];

          const mapped = content.map((p) => ({
            id: p.id,
            nickname: p.author?.nickname || '익명',
            title: p.title,
            content: p.summary || p.content || '',
            hCount: p.likeCount ?? 0,
            cCount: p.commentCount ?? 0,
            isScraped: true, // 북마크 목록이므로 기본 활성화
            agoDate: p.createdAt ? String(p.createdAt) : '',
            images: p.imageUrls || (p.thumbnailUrl ? [p.thumbnailUrl] : []),
            // 상세 페이지 전달용 데이터 정규화
            tripData: p.trip
              ? {
                  tripId: p.trip.id,
                  tripTitle: p.trip.name,
                  startDate: p.trip.startDate?.replace(/-/g, '.'),
                  endDate: p.trip.endDate?.replace(/-/g, '.'),
                  location: p.trip.place,
                  people: p.trip.maxMembers,
                  circleColor: p.trip.color,
                }
              : null,
          }));

          setScrapPosts(mapped);
        } catch (e) {
          console.error('북마크 목록 불러오기 실패:', e);
          Alert.alert('오류', '목록을 불러오는 중 문제가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      loadScrapPosts();
    }, []),
  );

  // 3. 북마크 취소 처리 (DELETE API 호출)
  const handleUnScrap = async (postId) => {
    try {
      await unbookmarkCommunityPost(postId);
      await unlikeCommunityPost(postId);
      // 성공 시 리스트에서 즉시 제거 (필터링)
      setScrapPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (e) {
      console.error('북마크 취소 실패:', e);
      Alert.alert('알림', '북마크 취소 처리에 실패했습니다.');
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scrapPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 저장한 글이 없어요.</Text>
        </View>
      ) : (
        <PostList
          data={scrapPosts}
          onScrap={handleUnScrap}
          onPress={(item) => {
            navigation.navigate('CommunityStack', {
              screen: 'CommunityContent',
              params: {
                post: item,
                postId: item.id,
              },
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  headerButton: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#000',
    width: 13,
    height: 13,
    marginLeft: 15,
  },
});

export default CommunityScrap;
