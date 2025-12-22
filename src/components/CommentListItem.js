import { FlatList } from 'react-native';
import CommentItem from './CommentItem';
import PropTypes from 'prop-types';

function CommentListItem({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommentItem
          nickname={item.nickname}
          date={item.date}
          comment={item.content}
          hcount={item.commentlike}
        />
      )}
      overScrollMode={'never'}
      bounces={false}
      scrollEnabled={false}
    />
  );
}

CommentListItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CommentListItem;
