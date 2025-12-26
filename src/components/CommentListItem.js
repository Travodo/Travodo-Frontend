import { FlatList } from 'react-native';
import CommentItem from './CommentItem';
import PropTypes from 'prop-types';

function CommentListItem({ data, onLike, onMore, myUserId }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CommentItem
          nickname={item.nickname}
          commentImageUri={item.profileImageUrl}
          date={item.date}
          comment={item.content}
          hcount={item.commentlike || 0}
          isLiked={item.isLiked || false}
          onLike={() => onLike(item.id)}
          onMore={() => onMore(item)}
          isMine={String(item.authorId) === String(myUserId)}
        />
      )}
      overScrollMode={'never'}
      bounces={false}
      scrollEnabled={false}
    />
  );
}

CommentListItem.propTypes = {
  data: PropTypes.array.isRequired,
  onLike: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
  myUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CommentListItem;
