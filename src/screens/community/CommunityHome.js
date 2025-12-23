import { View, StyleSheet, Text } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import PostList from '../../components/PostList';
import CategoriesList from '../../components/CategoriesList';
import Dropdown from '../../components/Dropdown';
import { CATEGORY_TABS, CommunityData } from '../../data/TripList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../styles/colors';
function CommunityHome({ navigation }) {
  const [isCategories, setIsCategories] = useState(['전체']);
  const [allPosts, setAllPosts] = useState([]);
  const [isDropDownVisiable, setIsDropDownVisable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');

  useFocusEffect(
    useCallback(() => {
      const loadPosts = async () => {
        try {
          const savedData = await AsyncStorage.getItem('community_data');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (Array.isArray(parsedData)) {
              setAllPosts(parsedData);
            } else {
              setAllPosts([]);
            }
          } else {
            setAllPosts([]);
          }
        } catch (e) {
          console.error('데이터 불러오기 실패:', e);
          setAllPosts([]);
        }
      };
      loadPosts();
    }, []),
  );

  const handleScrap = async (postId) => {
    const updatedPosts = allPosts.map((post) => {
      if (post.id === postId) {
        const newScrapStatus = !post.isScraped;
        return {
          ...post,
          isScraped: newScrapStatus,
          hCount: newScrapStatus ? (post.hCount || 0) + 1 : (post.hCount || 0) - 1,
        };
      }
      return post;
    });
    setAllPosts(updatedPosts);
    try {
      await AsyncStorage.setItem('community_data', JSON.stringify(updatedPosts));
    } catch (e) {
      console.error('스크랩 저장 실패:', e);
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

  const filteringPosts = useMemo(() => {
    if (!allPosts || !Array.isArray(allPosts)) return [];
    return allPosts.filter((post) => {
      if (isCategories.includes('전체')) return true;
      const postCategory = post.category || '기타';
      return isCategories.includes(postCategory);
    });
  }, [isCategories, allPosts]);

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
          options={['최신순', '오래된순']}
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
        data={filteringPosts}
        onScrap={handleScrap}
        onPress={(item) => {
          navigation.navigate('CommunityStack', { screen: 'CommunityContent' }, { post: item });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
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
  },
  dropdown: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default CommunityHome;
