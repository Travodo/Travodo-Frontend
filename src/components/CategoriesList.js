import { FlatList, View, StyleSheet } from 'react-native';
import Categories from './Categories';

function CategoriesList({ data, activeCategories, onSelectCategory }) {
  const CategoryItem = ({ item }) => {
    return (
      <View style={styles.margin}>
        <Categories
          property={item.label}
          onPress={() => onSelectCategory(item.label)}
          disable={activeCategories.includes(item.label)}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={CategoryItem}
      horizontal={true}
      overScrollMode={'never'}
      bounces={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.firstCategories}
    />
  );
}

const styles = StyleSheet.create({
  firstCategories: {
    paddingLeft: 24,
  },
  margin: {
    marginRight: 8,
  },
});

export default CategoriesList;
