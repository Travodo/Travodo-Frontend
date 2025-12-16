import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CalendarView from '../../components/Calendar';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';
import { getRandomColor } from '../../styles/cardColors';
import DatePickerModal from '../../components/DatePickerModal';

function TravelCreateScreen({ navigation }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visiblePicker, setVisiblePicker] = useState(null);
  const [tripData, setTripData] = useState({
    period: '',
    destination: '',
    name: '',
    companions: '',
  });

  const selectedRange = {
    start: startDate,
    end: endDate,
  };

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
    const color = getRandomColor();
    const companionString = tripData.companions ?? '';

    const newTripData = {
      destination: tripData.destination,
      name: tripData.name,
      startDate: startDate,
      endDate: endDate,
      companions: companionString
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
      code: Math.floor(10000 + Math.random() * 90000).toString(),
      color,
    };

    navigation.navigate('TravelComplete', { tripData: newTripData });
  };

  const renderFormInput = (label, value, field, placeholder, keyboardType = 'default') => (
    <View style={styles.formGroup} key={field}>
      <Text style={styles.label}>{label}</Text>
      {field === 'period' ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
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
                {startDate || '시작 날짜 선택'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.hyphen}>-</Text>

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
                {endDate || '종료 날짜 선택'}
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>여행 생성</Text>
        <Text style={styles.subtitle}>새로운 곳으로 여행을 떠나보세요!</Text>

        <View style={styles.calendarWrapper}>
          <CalendarView selectedRange={selectedRange} />
        </View>

        <View style={styles.form}>
          {renderFormInput('여행 기간', tripData.period, 'period', '날짜를 선택해주세요')}
          {renderFormInput('여행지', tripData.destination, 'destination', '예) 서울, 제주')}
          {renderFormInput('여행 이름', tripData.name, 'name', '예) 가족 여행, 친구들과의 여행')}
          {renderFormInput('동행자', tripData.companions, 'companions', '쉼표(,)로 구분해 입력')}
        </View>

        <View style={{ alignItems: 'center' }}>
          <Button text="여행 생성하기" onPress={handleCreateTrip} />
        </View>

        <DatePickerModal
          isVisible={visiblePicker !== null}
          mode={visiblePicker}
          onConfirm={handleConfirm}
          onCancel={() => setVisiblePicker(null)}
          initialDate={visiblePicker === 'start' ? startDate : endDate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default TravelCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
    color: colors.grayscale[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[700],
    marginBottom: 20,
  },
  calendarWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
  },
  form: {
    marginTop: 8,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 6,
    color: colors.grayscale[900],
  },
  inputTouchable: {
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    borderRadius: 10,
    backgroundColor: colors.grayscale[100],
  },
  dateButtonInner: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
  },
  placeholderText: {
    color: colors.grayscale[500],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grayscale[400],
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
    backgroundColor: colors.grayscale[100],
  },
  hyphen: {
    fontSize: 20,
    color: colors.grayscale[800],
    alignSelf: 'center',
  },
});
