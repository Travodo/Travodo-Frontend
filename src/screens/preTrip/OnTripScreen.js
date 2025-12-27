import React, { useCallback, useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import { renderSection } from '../../utils/renderSection';
import { colors } from '../../styles/colors';
import sharedStyles from './sharedStyles';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { clearOngoingTripFromStorage } from './PrepareScreen';
import {
  assignSharedItem,
  createSharedItem,
  deleteSharedItem,
  getSharedItems,
  unassignSharedItem,
  updateSharedItem,
  createPersonalItem,
  deletePersonalItem,
  getPersonalItems,
  updatePersonalItem,
  assignTodo,
  createTodo,
  deleteTodo,
  getTodos,
  unassignTodo,
  updateTodo,
  createMemo,
  deleteMemo,
  getMemos,
  getTripMembers,
  updateTripStatus,
} from '../../services/api';

const TODO_CATEGORY = {
  NECESSITY: 'NECESSITY',
  ACTIVITY: 'ACTIVITY',
};

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

  const [adding, setAdding] = useState(null); // 현재 추가 모드인 섹션
  const [text, setText] = useState(''); // 입력 중인 텍스트
  const [isEnding, setIsEnding] = useState(false); // 여행 종료 중 여부

  const hasLoadedRef = useRef(false); // 데이터 로딩 완료 여부 (중복 방지)

  const tripId = trip?.id;
  const colorPool = React.useMemo(() => ['#769FFF', '#FFE386', '#EE8787', '#A4C664'], []);

  // 데이터 정규화 함수
  
  /** API 응답을 UI 형식으로 변환 (content, checked, 담당자 정보 추가) */
  const normalizeItem = (item, sectionKey, travelersList) => {
    const base = {
      id: String(item.id),
      content: item.title || item.name || '',
      checked: item.status === 'DONE' || !!item.checked,
    };

    // 담당자 정보가 필요한 섹션 (공동 준비물, 필수 할 일)
    if (['shared', 'necessity'].includes(sectionKey)) {
      return {
        ...base,
        travelerId: item.assigneeId != null ? String(item.assigneeId) : null,
        travelerName: item.assigneeName ?? null,
        travelerColor:
          item.assigneeId != null
            ? (travelersList || []).find((t) => String(t.id) === String(item.assigneeId))?.color ?? null
            : null,
      };
    }

    // 담당자 정보가 필요 없는 섹션 (개인 준비물, 여행 활동)
    return {
      ...base,
      travelerId: null,
      travelerName: null,
      travelerColor: null,
    };
  };

  // 데이터 로딩
  /** 멤버, 준비물, Todo, 메모 전체 데이터 조회 (최초 1회만 실행) */
  const loadMembersAndItems = useCallback(async () => {
    if (!tripId) return;
    
    try {
      console.log('[OnTripScreen] 데이터 로딩 시작');

      // 1. 멤버 조회 및 색상 할당
      let mappedMembers = travelers;
      try {
        const membersResponse = await getTripMembers(tripId);
        const members = membersResponse?.data || membersResponse || [];
        
        if (Array.isArray(members) && members.length > 0) {
          mappedMembers = members
            .slice()
            .sort((a, b) => {
              if (a.isLeader && !b.isLeader) return -1;
              if (!a.isLeader && b.isLeader) return 1;
              return String(a.nickname || '').localeCompare(String(b.nickname || ''));
            })
            .map((m, idx) => ({
              id: String(m.userId),
              name: m.nickname,
              color: colorPool[idx % colorPool.length],
              isLeader: !!m.isLeader,
            }));

          setTravelers(mappedMembers);
          console.log('[OnTripScreen] 멤버 로딩 완료:', mappedMembers.length);
        }
      } catch (e) {
        console.error('[OnTripScreen] 멤버 조회 실패:', e);
      }

      // 2. 공동/개인 준비물 조회
      try {
        const [sharedRes, personalRes] = await Promise.all([
          getSharedItems(tripId),
          getPersonalItems(tripId),
        ]);

        const sharedItems = sharedRes?.data || sharedRes || [];
        const personalItems = personalRes?.data || personalRes || [];

        if (Array.isArray(sharedItems)) {
          setShared(sharedItems.map((it) => normalizeItem(it, 'shared', mappedMembers)));
          console.log('[OnTripScreen] 공동 준비물 로딩 완료:', sharedItems.length);
        }

        if (Array.isArray(personalItems)) {
          setPersonal(personalItems.map((it) => normalizeItem(it, 'personal', mappedMembers)));
          console.log('[OnTripScreen] 개인 준비물 로딩 완료:', personalItems.length);
        }
      } catch (e) {
        console.error('[OnTripScreen] 준비물 조회 실패:', e);
      }

      // 3. Todo 조회 (필수 할 일, 여행 활동)
      try {
        const todosRes = await getTodos(tripId);
        const todos = todosRes?.data || todosRes || [];

        if (Array.isArray(todos)) {
          const necessityList = todos
            .filter((t) => t.category === TODO_CATEGORY.NECESSITY)
            .map((it) => normalizeItem(it, 'necessity', mappedMembers));

          const activitiesList = todos
            .filter((t) => t.category === TODO_CATEGORY.ACTIVITY)
            .map((it) => normalizeItem(it, 'activities', mappedMembers));

          setNecessity(necessityList);
          setActivities(activitiesList);
          
          console.log('[OnTripScreen] 필수 할 일 로딩 완료:', necessityList.length);
          console.log('[OnTripScreen] 여행 활동 로딩 완료:', activitiesList.length);
        }
      } catch (e) {
        console.error('[OnTripScreen] Todo 조회 실패:', e);
      }

      // 4. 메모 조회
      try {
        const memosRes = await getMemos(tripId);
        const memosData = memosRes?.data?.memos || memosRes?.memos || memosRes?.data || memosRes || [];
        
        if (Array.isArray(memosData)) {
          const memosList = memosData.map((m) => ({
            id: String(m.id),
            title: m.title,
            content: m.content,
            updatedAt: m.updatedAt,
          }));

          setMemos(memosList);
          console.log('[OnTripScreen] 메모 로딩 완료:', memosList.length);
        }
      } catch (e) {
        console.error('[OnTripScreen] 메모 조회 실패:', e);
      }

      hasLoadedRef.current = true;
    } catch (e) {
      console.error('[OnTripScreen] 전체 데이터 로딩 실패:', e);
    }
  }, [tripId, colorPool, travelers]);

  /** 화면 포커스 시 데이터 로딩 (최초 1회만) */
  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedRef.current) {
        loadMembersAndItems();
      }
    }, [loadMembersAndItems]),
  );

  // CRUD 작업

  /** 아이템 추가 (섹션별 분기 처리) */
  const addItem = async (setter, list, sectionKey) => {
    if (!text.trim()) return;

    try {
      let created;

      switch (sectionKey) {
        case 'shared':
          created = await createSharedItem(tripId, { name: text.trim() });
          setShared((prev) => [...prev, normalizeItem(created, 'shared', travelers)]);
          console.log('[OnTripScreen] 공동 준비물 추가 완료:', created);
          break;

        case 'personal':
          created = await createPersonalItem(tripId, { name: text.trim() });
          setPersonal((prev) => [...prev, normalizeItem(created, 'personal', travelers)]);
          console.log('[OnTripScreen] 개인 준비물 추가 완료:', created);
          break;

        case 'necessity':
          created = await createTodo(tripId, {
            name: text.trim(),
            title: text.trim(),
            category: TODO_CATEGORY.NECESSITY,
          });
          // 백엔드가 category를 반환하지 않으면 클라이언트에서 추가
          const necessityItem = normalizeItem(created, 'necessity', travelers);
          necessityItem.category = TODO_CATEGORY.NECESSITY;
          setNecessity((prev) => [...prev, necessityItem]);
          console.log('[OnTripScreen] 필수 할 일 추가 완료:', created);
          break;

        case 'activities':
          created = await createTodo(tripId, {
            name: text.trim(),
            title: text.trim(),
            category: TODO_CATEGORY.ACTIVITY,
          });
          // 백엔드가 category를 반환하지 않으면 클라이언트에서 추가
          const activityItem = normalizeItem(created, 'activities', travelers);
          activityItem.category = TODO_CATEGORY.ACTIVITY; 
          setActivities((prev) => [...prev, activityItem]);
          console.log('[OnTripScreen] 여행 활동 추가 완료:', created);
          break;
      }

      setText('');
      setAdding(null);
    } catch (e) {
      console.error(`[OnTripScreen] ${sectionKey} 생성 실패:`, e);
      Alert.alert('실패', '항목 추가에 실패했습니다.');
    }
  };

  /** 아이템 삭제 (섹션별 분기 처리) */
  const deleteItem = async (list, setter, index, sectionKey) => {
    const item = list[index];

    try {
      switch (sectionKey) {
        case 'shared':
          await deleteSharedItem(tripId, item.id);
          setShared((prev) => prev.filter((x) => String(x.id) !== String(item.id)));
          break;

        case 'personal':
          await deletePersonalItem(tripId, item.id);
          setPersonal((prev) => prev.filter((x) => String(x.id) !== String(item.id)));
          break;

        case 'necessity':
        case 'activities':
          await deleteTodo(tripId, item.id);
          setter((prev) => prev.filter((x) => String(x.id) !== String(item.id)));
          break;
      }
      console.log(`[OnTripScreen] ${sectionKey} 삭제 완료:`, item.id);
    } catch (e) {
      console.error(`[OnTripScreen] ${sectionKey} 삭제 실패:`, e);
      Alert.alert('실패', '항목 삭제에 실패했습니다.');
    }
  };

  /** 아이템 수정 (섹션별 분기 처리) */
  const editItem = async (list, setter, index, value, sectionKey) => {
    const item = list[index];

    try {
      let updated;

      switch (sectionKey) {
        case 'shared':
          updated = await updateSharedItem(tripId, item.id, { name: value });
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'shared', travelers) : x,
            ),
          );
          break;

        case 'personal':
          updated = await updatePersonalItem(tripId, item.id, { name: value });
          setPersonal((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'personal', travelers) : x,
            ),
          );
          break;

        case 'necessity':
          updated = await updateTodo(tripId, item.id, {
            name: value,
            category: TODO_CATEGORY.NECESSITY,
          });
          setNecessity((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'necessity', travelers) : x,
            ),
          );
          break;

        case 'activities':
          updated = await updateTodo(tripId, item.id, {
            name: value,
            category: TODO_CATEGORY.ACTIVITY,
          });
          setActivities((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'activities', travelers) : x,
            ),
          );
          break;
      }
      console.log(`[OnTripScreen] ${sectionKey} 수정 완료:`, updated);
    } catch (e) {
      console.error(`[OnTripScreen] ${sectionKey} 수정 실패:`, e);
      Alert.alert('실패', '항목 수정에 실패했습니다.');
    }
  };

  /** 체크 상태 토글 (섹션별 분기 처리) */
  const toggleCheck = async (list, setter, index, sectionKey) => {
    const item = list[index];

    try {
      let updated;

      switch (sectionKey) {
        case 'shared':
          updated = await updateSharedItem(tripId, item.id, { checked: !item.checked });
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'shared', travelers) : x,
            ),
          );
          break;

        case 'personal':
          updated = await updatePersonalItem(tripId, item.id, { checked: !item.checked });
          setPersonal((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'personal', travelers) : x,
            ),
          );
          break;

        case 'necessity':
          updated = await updateTodo(tripId, item.id, {
            checked: !item.checked,
            category: TODO_CATEGORY.NECESSITY,
          });
          setNecessity((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'necessity', travelers) : x,
            ),
          );
          break;

        case 'activities':
          updated = await updateTodo(tripId, item.id, {
            checked: !item.checked,
            category: TODO_CATEGORY.ACTIVITY,
          });
          setActivities((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id) ? normalizeItem(updated, 'activities', travelers) : x,
            ),
          );
          break;
      }
      console.log(`[OnTripScreen] ${sectionKey} 체크 변경 완료`);
    } catch (e) {
      console.error(`[OnTripScreen] ${sectionKey} 체크 변경 실패:`, e);
      Alert.alert('실패', '체크 상태 변경에 실패했습니다.');
    }
  };

  /** 담당자 할당/해제 토글 (공동 준비물, 필수 할 일만 지원) */
  const assignTraveler = async (list, setter, index, sectionKey) => {
    const item = list[index];

    // 담당자 기능이 없는 섹션
    if (!['shared', 'necessity'].includes(sectionKey)) {
      return;
    }

    try {
      let updated;
      const isAssigned = !!item.travelerId;

      if (sectionKey === 'shared') {
        updated = isAssigned
          ? await unassignSharedItem(tripId, item.id)
          : await assignSharedItem(tripId, item.id);
        setShared((prev) =>
          prev.map((x) => (String(x.id) === String(item.id) ? normalizeItem(updated, 'shared', travelers) : x)),
        );
      } else if (sectionKey === 'necessity') {
        updated = isAssigned
          ? await unassignTodo(tripId, item.id)
          : await assignTodo(tripId, item.id);
        setNecessity((prev) =>
          prev.map((x) =>
            String(x.id) === String(item.id) ? normalizeItem(updated, 'necessity', travelers) : x,
          ),
        );
      }
      console.log(`[OnTripScreen] ${sectionKey} 담당자 변경 완료`);
    } catch (e) {
      console.error(`[OnTripScreen] ${sectionKey} 담당자 변경 실패:`, e);
      Alert.alert('안내', '담당자 지정/해제는 본인만 할 수 있습니다.');
    }
  };

  // 여행 종료
  
  /** 여행 종료 (상태를 FINISHED로 변경 후 EndTrip 화면으로 이동) */
  const handleEndTrip = () => {
    Alert.alert('여행 종료', '여행을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: async () => {
          if (isEnding) return;

          try {
            setIsEnding(true);

            if (!trip?.id) {
              Alert.alert('오류', '여행 정보를 찾을 수 없습니다.');
              return;
            }

            await updateTripStatus(trip.id, 'FINISHED');
            await clearOngoingTripFromStorage();

            Toast.show({
              type: 'success',
              text1: '여행이 종료되었습니다',
              text2: '즐거운 추억 되셨나요? 😊',
              text1Style: { fontSize: 16 },
              text2Style: { fontSize: 13 },
            });

            navigation.navigate('EndTrip', { trip });
          } catch (e) {
            console.error('[OnTripScreen] 여행 종료 실패:', e);
            Alert.alert('실패', '여행 종료에 실패했습니다.');
          } finally {
            setIsEnding(false);
          }
        },
      },
    ]);
  };

  // 렌더링
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.pageTitle}>여행 TODO 시작</Text>
      <Text style={sharedStyles.subTitle}>Travodo와 여행을 시작했어요!</Text>

      <View style={sharedStyles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={sharedStyles.content}>
        {/* 여행자 목록 */}
        <Text style={sharedStyles.sectionTitle}>여행자</Text>
        <View style={sharedStyles.travelerList}>
          {travelers.map((t) => (
            <TravelerAvatar key={t.id} name={t.name} color={t.color} showDelete={false} />
          ))}
        </View>

        <View style={sharedStyles.sectionDivider} />

        {/* 필수 할 일 */}
        {renderSection({
          title: '필수 할 일',
          list: necessity,
          setter: setNecessity,
          sectionKey: 'necessity',
          adding,
          setAdding,
          text,
          setText,
          addItem: (setter, list) => addItem(setter, list, 'necessity'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'necessity'),
          editItem: (list, setter, index, value) => editItem(list, setter, index, value, 'necessity'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'necessity'),
          assignTraveler: (list, setter, index) => assignTraveler(list, setter, index, 'necessity'),
          showAssignee: true,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {/* 공동 준비물 */}
        {renderSection({
          title: '공동 준비물',
          list: shared,
          setter: setShared,
          sectionKey: 'shared',
          adding,
          setAdding,
          text,
          setText,
          addItem: (setter, list) => addItem(setter, list, 'shared'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'shared'),
          editItem: (list, setter, index, value) => editItem(list, setter, index, value, 'shared'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'shared'),
          assignTraveler: (list, setter, index) => assignTraveler(list, setter, index, 'shared'),
          showAssignee: true,
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {/* 개인 준비물 */}
        {renderSection({
          title: '개인 준비물',
          list: personal,
          setter: setPersonal,
          sectionKey: 'personal',
          adding,
          setAdding,
          text,
          setText,
          addItem: (setter, list) => addItem(setter, list, 'personal'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'personal'),
          editItem: (list, setter, index, value) => editItem(list, setter, index, value, 'personal'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'personal'),
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {/* 여행 활동 */}
        {renderSection({
          title: '여행 활동',
          list: activities,
          setter: setActivities,
          sectionKey: 'activities',
          adding,
          setAdding,
          text,
          setText,
          addItem: (setter, list) => addItem(setter, list, 'activities'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'activities'),
          editItem: (list, setter, index, value) => editItem(list, setter, index, value, 'activities'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'activities'),
          styles: sharedStyles,
        })}
        <View style={sharedStyles.sectionDivider} />

        {/* 메모장 */}
        <Text style={sharedStyles.sectionTitle}>메모장</Text>

        {memos.map((memo) => (
          <View key={memo.id} style={sharedStyles.memoRow}>
            <Pressable
              style={sharedStyles.memoLeft}
              onPress={() =>
                navigation.navigate('MemoScreen', {
                  tripId,
                  memo,
                  onSave: (updatedMemo) => {
                    setMemos((prev) =>
                      prev.map((m) => (m.id === updatedMemo.id ? updatedMemo : m)),
                    );
                  },
                })
              }
            >
              <MaterialIcons name="description" size={22} color={colors.grayscale[500]} />
              <Text style={sharedStyles.memoText}>{memo.title}</Text>
            </Pressable>

            <Pressable
              onPress={async () => {
                try {
                  await deleteMemo(tripId, memo.id);
                  setMemos((prev) => prev.filter((m) => m.id !== memo.id));
                  console.log('[OnTripScreen] 메모 삭제 완료:', memo.id);
                } catch (e) {
                  console.error('[OnTripScreen] 메모 삭제 실패:', e);
                  Alert.alert('실패', '메모 삭제에 실패했습니다.');
                }
              }}
              hitSlop={8}
            >
              <MaterialIcons name="delete-outline" size={20} color={colors.grayscale[600]} />
            </Pressable>
          </View>
        ))}

        <View style={sharedStyles.plusCenter}>
          <Pressable
            style={sharedStyles.plusButton}
            onPress={() =>
              navigation.navigate('MemoScreen', {
                tripId,
                onSave: (newMemo) => {
                  setMemos((prev) => [...prev, newMemo]);
                  console.log('[OnTripScreen] 메모 추가 완료:', newMemo);
                },
              })
            }
          >
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={sharedStyles.sectionDivider} />

        {/* 여행 종료 버튼 */}
        <View style={styles.endButtonWrapper}>
          <Pressable
            style={[styles.endButton, isEnding && styles.endButtonDisabled]}
            onPress={handleEndTrip}
            disabled={isEnding}
          >
            <Text style={styles.endButtonText}>{isEnding ? '종료 중...' : '여행 종료'}</Text>
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
  endButtonDisabled: {
    opacity: 0.6,
  },
  endButtonText: {
    color: colors.grayscale[100],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
});