import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import ChecklistRow from '../../components/ChecklistRow';
import TravelerAvatar from '../../components/TravelerAvatar';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { colors } from '../../styles/colors';
import { renderSection } from '../../utils/renderSection';
import sharedStyles from './sharedStyles';

function PrepareScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const trip =
  route?.params?.tripData ??
  {
    name: '제주도 여행',
    destination: '제주',
    startDate: '2025.09.01',
    endDate: '2025.09.05',
    color: '#769FFF',
  };

  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  const [isAddingTraveler, setIsAddingTraveler] = useState(false);
  const [travelerName, setTravelerName] = useState('');

  const colorPool = ['#769FFF', '#FFE386', '#EE8787', '#A4C664'];

  const [necessity, setNecessity] = useState([]);
  const [shared, setShared] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [activities, setActivities] = useState([]);
  const [memos, setMemos] = useState([]);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');

  const deleteItem = (list, setter, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  const editItem = (list, setter, index, newContent) => {
    setter(list.map((item, i) => (i === index ? { ...item, content: newContent } : item)));
  };

  const addItem = (setter, list) => {
    if (!text.trim()) return;
    setter([
      ...list,
      {
        id: Date.now().toString(),
        content: text,
        travelerId: null,
        travelerName: null,
        travelerColor: null,
      },
    ]);

    setText('');
    setAdding(null);
  };

  const addTraveler = () => {
    if (!travelerName.trim()) return;

    setTravelers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: travelerName,
        color: colorPool[prev.length % colorPool.length],
      },
    ]);

    setTravelerName('');
    setIsAddingTraveler(false);
  };

  const assignTraveler = (list, setter, index) => {
    setter(
      list.map((item, i) => {
        if (i !== index) return item;

        if (!selectedTraveler) {
          Alert.alert('알림', '여행자를 먼저 선택해주세요!');
          return item;
        }

        const traveler = travelers.find((t) => t.id === selectedTraveler);

        if (!traveler) return item;

        return {
          ...item,
          travelerId: traveler.id,
          travelerName: traveler.name,
          travelerColor: traveler.color,
        };
      }),
    );
  };

  if (!trip) {
    return (
      <SafeAreaView style={sharedStyles.container}>
        <Text style={sharedStyles.pageTitle}>여행 정보를 불러올 수 없습니다</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.container}>
      <Text style={sharedStyles.pageTitle}>여행 준비 리스트</Text>
      <Text style={sharedStyles.subTitle}>신나는 여행을 준비해 봐요!</Text>

      <View style={sharedStyles.fixedCard}>
        <TripCard trip={trip} hideActions={true} />
      </View>

      <ScrollView contentContainerStyle={sharedStyles.content}>
        <Text style={sharedStyles.sectionTitle}>여행자</Text>

        <View style={styles.travelerRow}>
          {travelers.length === 0 ? (
            isAddingTraveler ? (
              <View style={styles.travelerInputBoxCenter}>
                <TextInput
                  style={styles.travelerInput}
                  value={travelerName}
                  onChangeText={setTravelerName}
                  placeholder="이름 입력"
                  autoFocus
                  onSubmitEditing={addTraveler}
                />
                <Pressable onPress={() => setIsAddingTraveler(false)}>
                  <MaterialIcons name="close" size={20} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.centerPlusButton} onPress={() => setIsAddingTraveler(true)}>
                <Plus width={24} height={24} />
              </Pressable>
            )
          ) : (
            <>
              <View style={sharedStyles.travelerList}>
                {travelers.map((t) => (
                  <TravelerAvatar
                    key={t.id}
                    name={t.name}
                    color={t.color}
                    selected={selectedTraveler === t.id}
                    onPress={() => setSelectedTraveler((prev) => (prev === t.id ? null : t.id))}
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

              {isAddingTraveler ? (
                <View style={styles.travelerInputBox}>
                  <TextInput
                    style={styles.travelerInput}
                    value={travelerName}
                    onChangeText={setTravelerName}
                    placeholder="이름 입력"
                    autoFocus
                    onSubmitEditing={addTraveler}
                  />
                  <Pressable onPress={() => setIsAddingTraveler(false)}>
                    <MaterialIcons name="close" size={20} />
                  </Pressable>
                </View>
              ) : (
                <Pressable style={styles.rightPlusButton} onPress={() => setIsAddingTraveler(true)}>
                  <Plus width={24} height={24} />
                </Pressable>
              )}
            </>
          )}
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
          assignTraveler,
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
          assignTraveler,
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
          showAssignee: false,
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
          showAssignee: false,
          styles: sharedStyles,
        })}

        <View style={sharedStyles.sectionDivider} />

        <Text style={sharedStyles.sectionTitle}>메모장</Text>

        {memos.map((memo) => (
          <View key={memo.id} style={sharedStyles.memoRow}>
            <Pressable
              style={sharedStyles.memoLeft}
              onPress={() =>
                navigation.navigate('Memo', {
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
              navigation.navigate('Memo', {
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

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              navigation.navigate('StartTrip', {
                  trip,
                  travelers,
                  necessity,
                  shared,
                  personal,
                  personal,
                  activities,
                  memos,
              })
            }
            >

            <Text style={styles.startText}>여행 시작</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert('확인', '모든 데이터를 삭제하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                {
                  text: '삭제',
                  style: 'destructive',
                  onPress: () => {
                    setTravelers([]);
                    setNecessity([]);
                    setShared([]);
                    setPersonal([]);
                    setActivities([]);
                    setMemos([]);
                  },
                },
              ]);
            }}
          >
            <Text style={styles.deleteText}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PrepareScreen;

const styles = StyleSheet.create({
  travelerRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerPlusButton: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: -15,
  },

  rightPlusButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },

  travelerInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },

  travelerInput: {
    minWidth: 100,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    fontFamily: 'Pretendard-Regular',
    paddingVertical: 4,
  },

  travelerInputBoxCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },

  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 12, 
    marginTop: 10 
  },

  startButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 23,
    marginHorizontal: 7,
  },

  startText: { 
    color: colors.grayscale[100], 
    fontFamily: 'Pretendard-SemiBold', 
    fontSize: 16 
  },

  deleteButton: {
    backgroundColor: colors.grayscale[400],
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 23,
    marginHorizontal: 7,
  },

  deleteText: { 
    color: colors.grayscale[100], 
    fontFamily: 'Pretendard-SemiBold', 
    fontSize: 16 
  },
});