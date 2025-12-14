import { FlatList } from 'react-native';
import CommentItem from './CommentItem';

function CommentListItem() {
  return(
<FlatList
      style={{ flex: 1, width: '100%' }}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      overScrollMode={'never'}
      bounces={false}
    />
  );
  )
}