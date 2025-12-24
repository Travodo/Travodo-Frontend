import { FlatList } from 'react-native';
import PostItem from './PostItem';
import PropTypes from 'prop-types';
import { colors } from '../styles/colors';

function PostList({ data, onPress, ListHeaderComponent, onScrap }) {
  return (
    <FlatList
      style={{
        flex: 1,
        width: '100%',
        borderTopWidth: 1,
        borderBottomColor: colors.grayscale[300],
      }}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PostItem post={item} onPress={() => onPress(item)} onScrap={() => onScrap(item.id)} />
      )}
      overScrollMode={'never'}
      bounces={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

PostList.propTypes = {
  data: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default PostList;
