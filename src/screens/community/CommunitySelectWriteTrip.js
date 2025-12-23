import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectMyTripList from '../../components/SelectMyTripList';
import Dropdown from '../../components/Dropdown';
import { useState, useMemo, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { data } from '../../data/TripList';

function CommunitySelectWriteTrip({ navigation }) {
  const [isDropDownVisiable, setIsDropDownVisable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('최신순');
  const [selectedTripId, setSelectedTripId] = useState(null);

  const headerHeight = useHeaderHeight();

  const handleNext = () => {
    if (!selectedTripId) {
      Alert.alert('알림', '공유할 여행을 선택해주세요.');
      return;
    }
    const selectedTrip = data.find((item) => item.id === selectedTripId);
    navigation.navigate('CommunityWrite', { tripData: selectedTrip });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.navigate('BottomTab')}>
          <Text
            style={{
              paddingLeft: 10,
              fontFamily: 'Pretendard-Regular',
              color: colors.grayscale[700],
              fontSize: 16,
            }}
          >
            취소
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleNext}>
          <Text
            style={{
              paddingRight: 10,
              fontFamily: 'Pretendard-SemiBold',
              color: colors.primary[700],
              fontSize: 16,
            }}
          >
            다음
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, selectedTripId]);

  const sortedData = useMemo(() => {
    const trips = [...data];
    return trips.sort((a, b) => {
      const dateA = new Date(a.startDate.replace(/\./g, '-'));
      const dateB = new Date(b.startDate.replace(/\./g, '-'));

      if (selectedSort === '최신순') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [selectedSort, data]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>공유할 여행 계획 선택</Text>
      </View>
      <Dropdown
        options={['최신순', '오래된순']}
        visible={isDropDownVisiable}
        selectedOption={selectedSort}
        onToggle={() => setIsDropDownVisable(!isDropDownVisiable)}
        onSelect={(option) => {
          setSelectedSort(option);
          setIsDropDownVisable(false);
        }}
      />
      <SelectMyTripList
        data={sortedData}
        selectedId={selectedTripId}
        onSelect={setSelectedTripId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'android' ? 80 : 20,
    gap: 16,
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
  },
  titleContainer: {
    paddingHorizontal: 24,
  },
  dropdownContainer: {
    paddingLeft: 8,
  },
});

export default CommunitySelectWriteTrip;
