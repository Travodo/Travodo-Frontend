import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import PostList from '../../components/PostList';
import { colors } from '../../styles/colors';

function CommunityScrap({ navigation }) {
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

  const [scrapPosts, setScrapPosts] = useState([]);
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
            navigation.navigate('CommunityContent', { post: item });
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
