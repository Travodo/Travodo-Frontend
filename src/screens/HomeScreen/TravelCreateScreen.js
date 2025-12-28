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
  Alert
} from 'react-native';
import CalendarView from '../../components/Calendar';
import Button from '../../components/Button';
import { colors } from '../../styles/colors';
import { colorPalette } from '../../styles/cardColors'; 
import DatePickerModal from '../../components/DatePickerModal';
import { useNavigation } from '@react-navigation/native';
import { createTrip, getCurrentTrip, getUpcomingTrips } from '../../services/api'; 

function TravelCreateScreen() {
  const navigation = useNavigation();

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
    if (visiblePicker === 'start') {
      setStartDate(date);
      setEndDate(date);
    }

    if (visiblePicker === 'end') {
      setEndDate(date);
    }

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

  const getAvailableColor = async () => {
    try {
      const [currentTrip, upcomingTrips] = await Promise.all([
        getCurrentTrip().catch(() => null),
        getUpcomingTrips().catch(() => []),
      ]);
      
      const usedColors = [];
      if (currentTrip?.color) usedColors.push(currentTrip.color);
      
      const upcoming = Array.isArray(upcomingTrips) 
        ? upcomingTrips 
        : (upcomingTrips?.trips ?? upcomingTrips?.data ?? []);
      
      upcoming.forEach(trip => {
        if (trip?.color) usedColors.push(trip.color);
      });
      
      const availableColors = colorPalette.filter(
        color => !usedColors.includes(color)
      );
      
      if (availableColors.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        return availableColors[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * colorPalette.length);
        return colorPalette[randomIndex];
      }
    } catch (e) {
      console.error('[TravelCreate] 색상 선택 실패:', e);
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      return colorPalette[randomIndex];
    }
  };

  const handleCreateTrip = async () => {
  try {
    const toIsoDate = (d) => String(d || '').replace(/\./g, '-');
    const toDotDate = (d) => String(d || '').replace(/-/g, '.');

    if (!tripData?.name?.trim() || !tripData?.destination?.trim() || !startDate || !endDate) {
      Alert.alert('알림', '여행 이름, 여행지, 날짜를 모두 입력해주세요.');
      return;
    }

    const selectedColor = await getAvailableColor();
    console.log('[TravelCreate] 선택된 색상:', selectedColor); 

    const maxMembers = 10;
    const requestBody = {
      name: tripData.name,
      place: tripData.destination,
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      maxMembers,
      color: selectedColor,
    };
    
    console.log('[TravelCreate] 요청 데이터:', requestBody); 
    
    const response = await createTrip(requestBody);
    
    console.log('[TravelCreate] 백엔드 응답:', response); 

    const createdTrip = response?.trip;
    const inviteCode = response?.inviteCode;

      navigation.navigate('TravelComplete', {
        tripData: {
          id: createdTrip?.id,
          name: createdTrip?.name,
          destination: createdTrip?.place,
          startDate: toDotDate(createdTrip?.startDate),
          endDate: toDotDate(createdTrip?.endDate),
          code: inviteCode,
          color: createdTrip?.color || selectedColor, 
          companions: (tripData.companions ?? '')
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0),
        },
      });
    } catch (e) {
      console.error('여행 생성 실패:', e);
      Alert.alert('실패', '여행 생성에 실패했습니다. 입력값/로그인을 확인해주세요.');
    }
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        bounces={false}
        overScrollMode="never"
      >
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
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[900],
    marginBottom: 24,
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
    fontFamily: 'Pretendard-Medium',
    marginBottom: 8,
    marginLeft: 2,
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