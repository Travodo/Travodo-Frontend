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

// 카테고리 라벨을 TravelTag enum으로 변환
const categoryLabelToTravelTag = (label) => {
  if (label === '전체') return null;
  if (label.includes('휴양') || label.includes('힐링')) return 'RELAXATION_HEALING';
  if (label.includes('액티비티')) return 'ACTIVITY';
  if (label.includes('역사') || label.includes('문화')) return 'HISTORY_CULTURE';
  if (label.includes('쇼핑')) return 'SHOPPING';
  if (label.includes('자연') || label.includes('캠핑')) return 'NATURE_CAMPING';
  if (label.includes('호캉스')) return 'HOCANCES';
  if (label.includes('미식')) return 'GOURMET';
  return null;
};

function CommunityHome({ navigation }) {
  const [isCategories, setIsCategories] = useState(['전체']);
  const [allPosts, setAllPosts] = useState([]);
  const [isDropDownVisiable, setIsDropDownVisable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [loading, setLoading] = useState(false);

  // 정렬 옵션을 백엔드 sort 파라미터로 변환
  const getSortParam = (sortOption) => {
    if (sortOption === '인기순') return 'popular';
    return 'recent'; // 최신순, 오래된순은 모두 recent로 가져온 후 클라이언트에서 정렬
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      // 선택된 카테고리를 TravelTag enum으로 변환
      const selectedTags = isCategories
        .filter((cat) => cat !== '전체')
        .map(categoryLabelToTravelTag)
        .filter((tag) => tag !== null);

      const sortParam = getSortParam(selectedSort);
      const res = await getCommunityPosts({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sort: sortParam,
        page: 0,
        size: 50,
      });

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
    } finally {
      setLoading(false);
    }
  }, [isCategories, selectedSort]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts]),
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
    // 카테고리 변경 시 API 호출은 useEffect에서 처리됨
  };

  // 정렬 로직 (오래된순만 클라이언트 사이드에서 처리)
  const sortedPosts = useMemo(() => {
    if (!allPosts || !Array.isArray(allPosts)) return [];

    // 오래된순만 클라이언트 사이드에서 정렬 (백엔드에서 지원하지 않음)
    if (selectedSort === '오래된순') {
      return [...allPosts].sort((a, b) => {
        if (a.rawDate && b.rawDate) {
          return new Date(a.rawDate) - new Date(b.rawDate);
        }
        return a.id - b.id;
      });
    }

    // 최신순, 인기순은 백엔드에서 정렬된 데이터를 그대로 사용
    return allPosts;
  }, [allPosts, selectedSort]);

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
            // 정렬 변경 시 API 호출은 useEffect에서 처리됨
          }}
        />
      </View>
      <PostList
        data={sortedPosts}
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
