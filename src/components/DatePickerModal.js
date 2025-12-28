import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const normalize = (size) => Math.round(size * scale);

const parseDateString = (dateString) => {
  if (!dateString || dateString.trim() === '') return new Date();
  const parts = dateString.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return new Date();
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function DatePickerModal({ isVisible, onConfirm, onCancel, mode, initialDate }) {
  const [date, setDate] = useState(parseDateString(initialDate));
  const [renderPicker, setRenderPicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    if (isVisible) {
      setDate(parseDateString(initialDate));

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setRenderPicker(true);
      }, 200);
    } else {
      Animated.timing(slideAnim, {
        toValue: 200,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setRenderPicker(false);
      });
    }
  }, [isVisible, initialDate]);

  const handleDateChange = (_, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
  };

  const handleConfirm = () => {
    onConfirm(formatDate(date));
  };

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onCancel} />

        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.modalTitle}>
            {mode === 'start' ? '시작 날짜 선택' : '종료 날짜 선택'}
          </Text>

          <View style={styles.pickerContainer}>
            {renderPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                locale="ko-KR"
                textColor={colors.grayscale[1000]}
                themeVariant="light"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

DatePickerModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['start', 'end']),
  initialDate: PropTypes.string,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: colors.grayscale[100],
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(24),
  },
  modalTitle: {
    fontSize: normalize(16),
    fontFamily: 'Pretendard-SemiBold',
    color: colors.grayscale[1000],
    textAlign: 'center',
    marginBottom: normalize(12),
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  datePicker: {
    width: '100%',
    height: normalize(180),
  },
  confirmBtn: {
    backgroundColor: colors.primary[700],
    borderRadius: normalize(12),
    alignItems: 'center',
    paddingVertical: normalize(14),
  },
  confirmText: {
    color: colors.grayscale[100],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: normalize(15),
  },
});
