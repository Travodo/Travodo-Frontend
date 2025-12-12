import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import TravodoLogo from '../../assets/Logo/TravodoLogo.svg';
import OptionButton from '../components/OptionButton';
import HeaderScrap from '../components/HeaderScrap';
import PostItem from '../components/PostItem';
import ListItem from '../components/ListItem';
import PostList from '../components/PostList';
import Categories from '../components/Categories';
import CategoriesList from '../components/CategoriesList';

const ALL_POSTS_DATA = [
  {
    id: 'p1',
    title: '커플 여행 후기',
    content: '제주도 추천해요',
    category: '커플 / 연인',
    nickname: 'A',
    hcount: 10,
    ccount: 2,
  },
  {
    id: 'p2',
    title: '가족 외식 장소',
    content: '부모님 모시고 가기 좋은 곳',
    category: '가족 / 친지',
    nickname: 'B',
    hcount: 5,
    ccount: 1,
  },
  {
    id: 'p3',
    title: '직장인 회식',
    content: '강남역 맛집',
    category: '직장 / 동료',
    nickname: 'C',
    hcount: 20,
    ccount: 4,
  },
  {
    id: 'p4',
    title: '유럽 여행 동행',
    content: '파리 같이 가실 분',
    category: '여행 / 취미',
    nickname: 'D',
    hcount: 12,
    ccount: 3,
  },
  {
    id: 'p5',
    title: '자유 게시글',
    content: '날씨가 좋네요',
    category: '전체',
    nickname: 'E',
    hcount: 8,
    ccount: 0,
  },
];

const CATEGORY_TABS = [
  { id: 'c0', label: '전체' },
  { id: 'c1', label: '커플 / 연인' },
  { id: 'c2', label: '가족 / 친지' },
  { id: 'c3', label: '직장 / 동료' },
  { id: 'c4', label: '친구 / 지인' },
  { id: 'c5', label: '여행 / 취미' },
  { id: 'c6', label: '스터디 / 모임' },
];

function ComunityHome({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerLeft: () => <TravodoLogo width={100} height={20} marginLeft={10} />,
      headerTitle: '',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <HeaderScrap
            style={{ marginRight: 15 }}
            size={20}
            onPress={() => console.log('스크랩')}
          />
          <OptionButton size={20} onPress={() => console.log('환경설정')} />
        </View>
      ),
    });
  });

  const [isCategories, setIsCategories] = useState(['전체']);

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

  const filteringPosts = useMemo(() => {
    return ALL_POSTS_DATA.filter((post) => {
      if (isCategories.includes('전체')) return true;
      return isCategories.includes(post.category);
    });
  }, [isCategories]);

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
      <PostList data={filteringPosts} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
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
    fontFamily: 'Prentendard-Regular',
    fontSize: 16,
  },
  categories: {
    flexDirection: 'row',
  },
});

export default ComunityHome;
