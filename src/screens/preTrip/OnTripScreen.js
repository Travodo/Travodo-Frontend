import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import { renderSection } from '../../utils/renderSection';
import { colors } from '../../styles/colors';
import sharedStyles from './sharedStyles';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { updateTripStatus } from '../../services/api';

function OnTripScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    trip,
    travelers: initTravelers = [],
    necessity: initNecessity = [],
    shared: initShared = [],
    personal: initPersonal = [],
    activities: initActivities = [],
    memos: initMemos = [],
  } = route.params || {};

  const [travelers, setTravelers] = useState(initTravelers);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [necessity, setNecessity] = useState(initNecessity);
  const [shared, setShared] = useState(initShared);
  const [personal, setPersonal] = useState(initPersonal);
  const [activities, setActivities] = useState(initActivities);
  const [memos, setMemos] = useState(initMemos);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');

  const addItem = (setter, list) => {
    if (!text.trim()) return;
    setter([...list, { id: Date.now().toString(), content: text }]);
    setText('');
    setAdding(null);
  };

  const deleteItem = (list, setter, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  const editItem = (list, setter, index, value) => {
    setter(list.map((item, i) => (i === index ? { ...item, content: value } : item)));
  };

  const handleEndTrip = () => {
    Alert.alert('여행 종료', '여행을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: async () => {
          try {
            if (trip?.id != null) {
              await updateTripStatus(trip.id, 'FINISHED');
            }
          } catch (e) {
            console.error('여행 종료(상태 변경) 실패:', e);
          } finally {
            // 현재 화면은 TripStack 내부이므로 직접 이동(중첩 navigate로 인한 라우트 누락 방지)
            navigation.navigate('EndTrip', { trip });
          }
        },
      },
    ]);
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.pageTitle}>여행 TODO 시작</Text>
      <Text style={sharedStyles.subTitle}>Travodo와 여행을 시작했어요!</Text>

      <View style={sharedStyles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={sharedStyles.content}>
        <Text style={sharedStyles.sectionTitle}>여행자</Text>
        <View style={sharedStyles.travelerList}>
          {travelers.map((t) => (
            <TravelerAvatar 
              key={t.id} 
              name={t.name} 
              color={t.color}
              showDelete={true}
              onDelete={() => {
                                    Alert.alert('여행자 삭제', `${t.name}님을 삭제하시겠습니까?`, [
                                      { text: '취소', style: 'cancel' },
                                      {
                                        text: '삭제',
                                        style: 'destructive',
                                        onPress: () => {
                                          setTravelers((prev) => prev.filter((traveler) => traveler.id !== t.id));
                                          if (selectedTraveler === t.id) {
                                            setSelectedTraveler(null);
                                          }
                                        },
                                      },
                                    ]);
                                  }}
            />
          ))}
        </View>

        <View style={sharedStyles.sectionDivider} />

        {renderSection({
          title: '필수 할 일',
          list: necessity,
          setter: setNecessity,
          sectionKey: 'necessity',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          showAssignee: true,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {renderSection({
          title: '공동 준비물',
          list: shared,
          setter: setShared,
          sectionKey: 'shared',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          showAssignee: true,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {renderSection({
          title: '개인 준비물',
          list: personal,
          setter: setPersonal,
          sectionKey: 'personal',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {renderSection({
          title: '여행 활동',
          list: activities,
          setter: setActivities,
          sectionKey: 'activities',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        <Text style={sharedStyles.sectionTitle}>메모장</Text>

        {memos.map((memo) => (
          <View key={memo.id} style={sharedStyles.memoRow}>
            <Pressable
              style={sharedStyles.memoLeft}
              onPress={() =>
                navigation.navigate('MemoScreen', {
                  memo,
                  onSave: (updatedMemo) => {
                    setMemos((prev) => prev.map((m) => (m.id === updatedMemo.id ? updatedMemo : m)));
                  },
                })
              }
            >
              <MaterialIcons name="description" size={22} color={colors.grayscale[500]} />
              <Text style={sharedStyles.memoText}>{memo.title}</Text>
            </Pressable>

            <Pressable onPress={() => setMemos((prev) => prev.filter((m) => m.id !== memo.id))} hitSlop={8}>
              <MaterialIcons name="delete-outline" size={20} color={colors.grayscale[600]} />
            </Pressable>
          </View>
        ))}

        <View style={sharedStyles.plusCenter}>
          <Pressable
            style={sharedStyles.plusButton}
            onPress={() =>
              navigation.navigate('MemoScreen', {
                onSave: (newMemo) => {
                  setMemos((prev) => [...prev, newMemo]);
                },
              })
            }
          >
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={sharedStyles.sectionDivider} />

        <View style={styles.endButtonWrapper}>
          <Pressable 
            style={styles.endButton} 
            onPress={handleEndTrip}
          >
            <Text style={styles.endButtonText}>여행 종료</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default OnTripScreen;

const styles = StyleSheet.create({
  endButtonWrapper: {
    marginTop: 16,
  },

  endButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 100,
    marginVertical: 20,
  },

  endButtonText: {
    color: colors.grayscale[100],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
});