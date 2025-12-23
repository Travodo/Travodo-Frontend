import { View, StyleSheet, Text } from 'react-native';
import { useState, useCallback } from 'react';
import PostList from '../../components/PostList';
import { colors } from '../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyWriteTrip({ navigation }) {
  const [myPosts, setMyPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchMyPosts();
    }, []),
  );

  const fetchMyPosts = async () => {
    try {
      const savedData = await AsyncStorage.getItem('community_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          const myData = parsedData.filter((post) => post.nickname === '히재');
          setMyPosts(myData);
        }
      } else {
        setMyPosts([]);
      }
    } catch (error) {
      console.error('내 글 조회 실패:', error);
    }
  };

  const handleUnScrap = async (postId) => {
    try {
      const savedData = await AsyncStorage.getItem('community_data');
      if (!savedData) return;

      const allPosts = JSON.parse(savedData);

      const updatedAllPosts = allPosts.map((post) => {
        if (post.id === postId) {
          const newScrapStatus = !post.isScrap;
          return {
            ...post,
            isScrap: newScrapStatus,
            hCount: newScrapStatus
              ? (Number(post.hCount) || 0) + 1
              : (Number(post.hCount) || 0) - 1,
          };
        }
        return post;
      });
      await AsyncStorage.setItem('community_data', JSON.stringify(updatedAllPosts));
      const updatedMyPosts = updatedAllPosts.filter((post) => post.nickname === '히재');
      setMyPosts(updatedMyPosts);
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
});

export default MyWriteTrip;
