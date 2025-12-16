import { FlatList } from 'react-native';
import PostItem from './PostItem';
import PropTypes from 'prop-types';

function PostList({ data, onPress }) {
  return (
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} onPress={onPress} />}
      overScrollMode={'never'}
      bounces={false}
    />
  );
}

PostItem.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PostList;
