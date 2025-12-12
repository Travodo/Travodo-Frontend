import { FlatList, StyleSheet } from 'react-native';
import PostItem from './PostItem';

function PostList({ data }) {
  return (
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      overScrollMode={'never'}
      bounces={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default PostList;
