import { View, StyleSheet, Text, Alert } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import PostList from '../../components/PostList';
import CategoriesList from '../../components/CategoriesList';
import Dropdown from '../../components/Dropdown';
import { CATEGORY_TABS, CommunityData } from '../../data/TripList';
import { useFocusEffect } from '@react-navigation/native';
import FAB from '../../components/FAB';
import {
  bookmarkCommunityPost,
  getCommunityPosts,
  likeCommunityPost,
  unbookmarkCommunityPost,
  unlikeCommunityPost,
} from '../../services/api';
import { formatAgo } from '../../utils/dateFormatter';

const toDotDate = (d) => (d ? String(d).replace(/-/g, '.') : '');

function CommunityHome({ navigation }) {
  const [isCategories, setIsCategories] = useState(['전체']);
  const [allPosts, setAllPosts] = useState([]);
  const [isDropDownVisiable, setIsDropDownVisable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');

  useFocusEffect(
    useCallback(() => {
      const loadPosts = async () => {
        try {
          // [수정 1] 정렬과 상관없이 최신 데이터(recent)를 한 번만 넉넉히 가져옵니다.
          const res = await getCommunityPosts({ sort: 'recent', page: 0, size: 50 });

          const content = res?.content || [];
          const mapped = content.map((p) => ({
            id: p.id,
            nickname: p.author?.nickname || '',
            profileImage: p.author?.profileImageUrl || null,
            title: p.title,
            content: p.summary || p.content || '',
            hCount: p.likeCount ?? 0,
            cCount: p.commentCount ?? 0,
            isScraped: p.isLiked ?? false,
            agoDate: p.createdAt ? formatAgo(p.createdAt) : '',

            // [수정 2] 클라이언트 정렬을 위해 원본 날짜 저장
            rawDate: p.createdAt || '',

            images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
            category: '기타',
            tripData: p.trip
              ? {
                  tripId: p.trip?.id ?? p.tripId,
                  tripTitle: p.trip?.name ?? '',
                  startDate: toDotDate(p.trip?.startDate),
                  endDate: toDotDate(p.trip?.endDate),
                  location: p.trip?.place ?? '',
                  people: Number(p.trip?.maxMembers ?? 0),
                  todo: null,
                  circleColor: p.trip?.color ?? '',
                }
              : null,
          }));
          setAllPosts(mapped);
        } catch (e) {
          console.error('데이터 불러오기 실패:', e);
          setAllPosts(CommunityData);
        }
      };
      loadPosts();
    }, []), // [수정 3] 의존성 배열 비움 (정렬 변경 시 API 호출 X)
  );

  const handleScrap = async (postId) => {
    const targetPost = allPosts.find((p) => p.id === postId);
    if (!targetPost) return;

    const isCurrentlyLiked = targetPost.isScraped;
    const nextStatus = !isCurrentlyLiked;

    setAllPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isScraped: nextStatus,
            hCount: nextStatus ? (post.hCount || 0) + 1 : (post.hCount || 0) - 1,
          };
        }
        return post;
      }),
    );

    try {
      if (isCurrentlyLiked) {
        await unlikeCommunityPost(postId);
        await unbookmarkCommunityPost(postId);
      } else {
        await likeCommunityPost(postId);
        await bookmarkCommunityPost(postId);
      }
    } catch (error) {
      setAllPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isScraped: isCurrentlyLiked,
              hCount: targetPost.hCount,
            };
          }
          return post;
        }),
      );
      Alert.alert('알림', '좋아요 처리에 실패했습니다.');
    }
  };

  const selectCategories = (categoryLabel) => {
    if (categoryLabel === '전체') {
      setIsCategories(['전체']);
      return;
    }
    const categoryRemoveAll = isCategories.filter((cat) => cat !== '전체');

    if (categoryRemoveAll.includes(categoryLabel)) {
      const categoryAutoAll = categoryRemoveAll.filter((cat) => cat !== categoryLabel);
      setIsCategories(categoryAutoAll.length === 0 ? ['전체'] : categoryAutoAll);
    } else {
      setIsCategories([...categoryRemoveAll, categoryLabel]);
    }
  };

  // [수정 4] 필터링 + 정렬 로직 (클라이언트 사이드)
  const sortedAndFilteredPosts = useMemo(() => {
    if (!allPosts || !Array.isArray(allPosts)) return [];

    // 1. 카테고리 필터링
    let result = allPosts.filter((post) => {
      if (isCategories.includes('전체')) return true;
      const postCategory = post.category || '기타';
      return isCategories.includes(postCategory);
    });

    // 2. 정렬 (원본 배열 보호를 위해 [...result] 사용)
    result = [...result].sort((a, b) => {
      if (selectedSort === '최신순') {
        // 날짜 내림차순 (최신 -> 과거)
        // rawDate가 없으면 id 역순 (id가 클수록 최신)
        if (a.rawDate && b.rawDate) {
          return new Date(b.rawDate) - new Date(a.rawDate);
        }
        return b.id - a.id;
      } else if (selectedSort === '오래된순') {
        // 날짜 오름차순 (과거 -> 최신)
        if (a.rawDate && b.rawDate) {
          return new Date(a.rawDate) - new Date(b.rawDate);
        }
        return a.id - b.id;
      } else if (selectedSort === '인기순') {
        // 좋아요(hCount) 많은 순 -> 같으면 최신순
        if (b.hCount !== a.hCount) {
          return b.hCount - a.hCount;
        }
        return b.id - a.id;
      }
      return 0;
    });

    return result;
  }, [isCategories, allPosts, selectedSort]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>커뮤니티</Text>
        <Text style={styles.subTitle}>여행자들과 여행 계획을 공유해보세요!</Text>
      </View>
      <View style={styles.categories}>
        <CategoriesList
          data={CATEGORY_TABS}
          activeCategories={isCategories}
          onSelectCategory={selectCategories}
        />
      </View>
      <View style={styles.dropdown}>
        <Dropdown
          options={['최신순', '오래된순', '인기순']}
          visible={isDropDownVisiable}
          selectedOption={selectedSort}
          onToggle={() => setIsDropDownVisable(!isDropDownVisiable)}
          onSelect={(option) => {
            setSelectedSort(option);
            setIsDropDownVisable(false);
          }}
        />
      </View>
      <PostList
        data={sortedAndFilteredPosts} // [수정] 정렬된 데이터 전달
        onScrap={handleScrap}
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
      <FAB
        icon="add"
        onCreatePress={() =>
          navigation.navigate('HomeTab', {
            screen: 'TravelCreate',
          })
        }
        onJoinPress={() =>
          navigation.navigate('HomeTab', {
            screen: 'Join',
          })
        }
        onWritePress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'CommunitySelectWriteTrip',
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  titleContainer: {
    marginLeft: 24,
    gap: 4,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
  },
  subTitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  categories: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default CommunityHome;
