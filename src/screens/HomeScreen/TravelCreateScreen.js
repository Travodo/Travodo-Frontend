import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import CalendarView from '../../components/Calendar';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';
import DatePickerModal from '../../components/DatePickerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

const initialTripData = {
  period: '',
  destination: '',
  name: '',
  memberCount: '',
};

function TravelCreateScreen({ navigation }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visiblePicker, setVisiblePicker] = useState(null);
  const [tripData, setTripData] = useState(initialTripData);

  const handleConfirm = (date) => {
    if (visiblePicker === 'start') setStartDate(date);
    if (visiblePicker === 'end') setEndDate(date);
    setVisiblePicker(null);
  };

  useEffect(() => {
    if (startDate && endDate) {
      setTripData((prev) => ({
        ...prev,
        period: `${startDate} ~ ${endDate}`,
      }));
    }
  }, [startDate, endDate]);

  const handleInputChange = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTrip = () => {
    console.log('여행 생성 데이터:', tripData);
  };

  const renderFormInput = (label, value, field, placeholder, keyboardType = 'default') => (
    <View style={styles.formGroup} key={field}>
      <Text style={styles.label}>{label}</Text>
      {field === 'period' ? (
        <View style={{ flexDirection: 'row', gap: normalize(10) }}>
          <TouchableOpacity
            style={[styles.inputTouchable, { flex: 1 }]}
            onPress={() => {
              Keyboard.dismiss();
              setVisiblePicker('start');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.dateButtonInner}>
              <Text style={[styles.dateText, !startDate && styles.placeholderText]}>
                {startDate || '시작 날짜를 선택해주세요'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.hyphen}> - </Text>

          <TouchableOpacity
            style={[styles.inputTouchable, { flex: 1 }]}
            onPress={() => {
              Keyboard.dismiss();
              setVisiblePicker('end');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.dateButtonInner}>
              <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
                {endDate || '종료 날짜를 선택해주세요'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => handleInputChange(field, text)}
          keyboardType={keyboardType}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: normalize(40) }}>
      <Text style={styles.title}>여행 생성</Text>
      <Text style={styles.subtitle}>새로운 곳으로 여행을 떠나보세요!</Text>
      <View style={styles.calendarWrapper}>
        <CalendarView selectedRange={{ start: startDate, end: endDate }} />
      </View>
      <View style={styles.form}>
        {renderFormInput('여행 기간', tripData.period, 'period', '날짜를 선택해주세요')}
        {renderFormInput('여행지', tripData.destination, 'destination', '예) 서울, 제주')}
        {renderFormInput('여행 이름', tripData.name, 'name', '예) 가족 여행, 친구들과의 여행')}
        {renderFormInput('여행 인원', tripData.memberCount, 'memberCount', '인원 수', 'numeric')}
      </View>
      <Button text="여행 생성하기" onPress={handleCreateTrip} />
      {visiblePicker && (
        <DatePickerModal
          isVisible={true}
          mode={visiblePicker}
          onConfirm={handleConfirm}
          onCancel={() => setVisiblePicker(null)}
          initialDate={visiblePicker === 'start' ? startDate : endDate}
        />
      )}
    </ScrollView>
  );
}

export default TravelCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: normalize(24),
    paddingTop: normalize(40),
  },

  title: {
    fontSize: normalize(22),
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[900],
    marginBottom: normalize(8),
  },

  subtitle: {
    fontSize: normalize(14),
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[700],
    marginBottom: normalize(20),
  },

  calendarWrapper: {
    borderRadius: normalize(18),
    overflow: 'hidden',
    marginBottom: normalize(24),
  },

  form: {
    marginBottom: normalize(24),
  },

  formGroup: {
    marginBottom: normalize(20),
  },

  label: {
    fontSize: normalize(14),
    fontFamily: 'Pretendard-Regular',
    marginBottom: normalize(6),
    color: colors.grayscale[900],
  },

  inputTouchable: {
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    borderRadius: normalize(10),
    backgroundColor: colors.grayscale[100],
  },

  dateButtonInner: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(14),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  dateText: {
    fontSize: normalize(14),
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
  },

  placeholderText: {
    color: colors.grayscale[500],
  },

  input: {
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    borderRadius: normalize(10),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(14),
    fontSize: normalize(14),
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
    backgroundColor: colors.grayscale[100],
  },

  hyphen: {
    fontSize: normalize(20),
    color: colors.grayscale[800],
  },
});
