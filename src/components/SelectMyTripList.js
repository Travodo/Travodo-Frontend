import { FlatList } from 'react-native';
import SelectMyTrip from './SelectMyTrip';
import propTypes from 'prop-types';

function SelectMyTripList({ data, selectedId, onSelect }) {
  return (
    <FlatList
      bounces={false}
      overScrollMode="never"
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <SelectMyTrip
          id={item.id}
          title={item.tripTitle}
          startDate={item.startDate}
          endDate={item.endDate}
          circleColor={item.circleColor}
          isSelected={String(item.id) === String(selectedId)}
          onPress={() => onSelect(item.id)}
        />
      )}
    />
  );
}

export default SelectMyTripList;
