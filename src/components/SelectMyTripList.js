import { FlatList } from 'react-native';
import SelectMyTrip from './SelectMyTrip';
import PropTypes from 'prop-types';

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

SelectMyTripList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      tripTitle: PropTypes.string.isRequired,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      circleColor: PropTypes.string,
    }),
  ).isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
};

export default SelectMyTripList;
