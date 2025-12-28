import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import { renderSection } from '../../utils/renderSection';
import { colors } from '../../styles/colors';
import sharedStyles from './sharedStyles';
import Plus from '../../../assets/ProfileImg/Plus.svg';

import {
  createSharedItem,
  updateSharedItem,
  deleteSharedItem,
  assignSharedItem,
  unassignSharedItem,
  getSharedItems,
  createPersonalItem,
  updatePersonalItem,
  deletePersonalItem,
  getPersonalItems,
  createTodo,
  updateTodo,
  deleteTodo,
  assignTodo,
  unassignTodo,
  getTodos,
  createActivity,
  updateActivityContent,
  updateActivityStatus,
  deleteActivity,
  getActivities,
  getMemos,
  createMemo,
  deleteMemo,
  getTripMembers,
  updateTripStatus,
} from '../../services/api';

const COLOR_POOL = ['#769FFF', '#FFE386', '#EE8787', '#A4C664'];
const SECTION_NAMES = {
  shared: '공동 준비물',
  personal: '개인 준비물',
  necessity: '필수 할 일',
  activities: '여행 활동',
};
const ONGOING_TRIP_KEY = '@ongoing_trip_status';

const transformToUiModel = (item, type, travelers = [], colorMap = {}) => {
  if (!item) return null;
  const isTodoOrActivity = type === 'necessity' || type === 'activities';

  let realId = item.id;
  if (!realId && type === 'necessity') realId = item.todoId;
  if (!realId && type === 'activities') realId = item.activityId;

  const id = realId != null ? String(realId) : `temp-${Date.now()}-${Math.random()}`;
  const content = isTodoOrActivity ? item.title || item.name || '' : item.name || item.title || '';

  let checked = false;
  if (isTodoOrActivity) {
    const status = (item.status || '').toUpperCase();
    checked = status === 'DONE';
  } else {
    checked = !!item.checked;
  }

  const base = { id, content, checked, time: item.time || null };

  if (type === 'shared' || type === 'necessity') {
    const assigneeId = item.assigneeId ? String(item.assigneeId) : null;
    return {
      ...base,
      travelerId: assigneeId,
      travelerName: item.assigneeName || null,
      travelerColor: assigneeId ? colorMap[assigneeId] || null : null,
    };
  }
  return { ...base, travelerId: null, travelerName: null, travelerColor: null };
};

const API_ADAPTER = {
  shared: {
    create: (tripId, text) => createSharedItem(tripId, { name: text }),
    update: (tripId, id, data) => {
      const payload = {};
      if (data.title) payload.name = data.title;
      if (data.checked !== undefined) payload.checked = data.checked;
      return updateSharedItem(tripId, id, payload);
    },
    delete: deleteSharedItem,
    assign: assignSharedItem,
    unassign: unassignSharedItem,
  },
  personal: {
    create: (tripId, text) => createPersonalItem(tripId, { name: text }),
    update: (tripId, id, data) => {
      const payload = {};
      if (data.title) payload.name = data.title;
      if (data.checked !== undefined) payload.checked = data.checked;
      return updatePersonalItem(tripId, id, payload);
    },
    delete: deletePersonalItem,
  },
  necessity: {
    create: (tripId, text) => createTodo(tripId, { title: text }),
    update: (tripId, id, data) => {
      const payload = {};
      if (data.title) payload.title = data.title;
      if (data.checked !== undefined) payload.status = data.checked ? 'DONE' : 'UNDONE';
      return updateTodo(tripId, id, payload);
    },
    delete: (tripId, id) => deleteTodo(tripId, id),
    assign: assignTodo,
    unassign: unassignTodo,
  },
  activities: {
    create: (tripId, text) => createActivity(tripId, { title: text }),
    update: async (tripId, id, data) => {
      // 상태 변경 (PATCH): 400 에러 방지를 위해 문자열("DONE")을 직접 전송
      if (data.checked !== undefined) {
        const status = data.checked ? 'DONE' : 'PENDING';
        try {
          await updateActivityStatus(tripId, Number(id), status);
          return { _isPatch: true, id, checked: data.checked };
        } catch (e) {
          if (e.response?.status === 400)
            Alert.alert('요청 오류', '서버 요청 형식이 올바르지 않습니다.');
          throw e;
        }
      }
      // 내용 수정 (PUT)
      return updateActivityContent(tripId, Number(id), { title: data.title });
    },
    delete: (tripId, id) => deleteActivity(tripId, Number(id)),
  },
};

const setOngoingTripInStorage = async (isOngoing, tripId = null) => {
  try {
    await AsyncStorage.setItem(ONGOING_TRIP_KEY, JSON.stringify({ isOngoing, tripId }));
  } catch (e) {}
};

const getOngoingTripFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(ONGOING_TRIP_KEY);
    return value ? JSON.parse(value) : { isOngoing: false, tripId: null };
  } catch (e) {
    return { isOngoing: false, tripId: null };
  }
};

const clearOngoingTripFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(ONGOING_TRIP_KEY);
  } catch (e) {}
};

const useItemOperations = (tripId, sectionKey, setter, travelers, colorMap) => {
  const adapter = API_ADAPTER[sectionKey];

  const create = useCallback(
    async (text) => {
      if (!text.trim()) return;
      try {
        const rawItem = await adapter.create(tripId, text.trim());
        const uiItem = transformToUiModel(rawItem, sectionKey, travelers, colorMap);
        if (uiItem) setter((prev) => [...prev, uiItem]);
      } catch (e) {
        Alert.alert('실패', `${SECTION_NAMES[sectionKey]} 추가에 실패했습니다.`);
      }
    },
    [tripId, sectionKey, setter, travelers, colorMap, adapter],
  );

  const update = useCallback(
    async (itemId, updates) => {
      try {
        const result = await adapter.update(tripId, itemId, updates);
        if (result && result._isPatch) {
          setter((prev) =>
            prev.map((item) =>
              String(item.id) === String(itemId) ? { ...item, checked: result.checked } : item,
            ),
          );
          return;
        }
        const uiItem = transformToUiModel(result, sectionKey, travelers, colorMap);
        if (uiItem)
          setter((prev) =>
            prev.map((item) => (String(item.id) === String(itemId) ? uiItem : item)),
          );
      } catch (e) {
        console.error(`[${sectionKey}] 수정 실패:`, e);
      }
    },
    [tripId, sectionKey, setter, travelers, colorMap, adapter],
  );

  const remove = useCallback(
    async (itemId) => {
      if (!itemId || String(itemId).startsWith('temp-')) {
        Alert.alert('오류', '유효하지 않은 항목입니다.');
        return;
      }
      try {
        await adapter.delete(tripId, itemId);
        setter((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
      } catch (e) {
        Alert.alert('실패', `삭제에 실패했습니다.`);
      }
    },
    [tripId, sectionKey, setter, adapter],
  );

  const toggleCheck = useCallback(
    async (itemId, currentChecked) => {
      await update(itemId, { checked: !currentChecked });
    },
    [update],
  );

  const toggleAssign = useCallback(
    async (itemId, isCurrentlyAssigned) => {
      if (!adapter.assign) return;
      try {
        const method = isCurrentlyAssigned ? adapter.unassign : adapter.assign;
        const rawItem = await method(tripId, itemId);
        const uiItem = transformToUiModel(rawItem, sectionKey, travelers, colorMap);
        if (uiItem)
          setter((prev) =>
            prev.map((item) => (String(item.id) === String(itemId) ? uiItem : item)),
          );
      } catch (e) {
        Alert.alert('안내', '담당자 변경에 실패했습니다.');
      }
    },
    [tripId, sectionKey, setter, travelers, colorMap, adapter],
  );

  return { create, update, remove, toggleCheck, toggleAssign };
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

  const tripId = trip?.id;

  const [travelers, setTravelers] = useState(initTravelers);
  const [necessity, setNecessity] = useState(initNecessity);
  const [shared, setShared] = useState(initShared);
  const [personal, setPersonal] = useState(initPersonal);
  const [activities, setActivities] = useState(initActivities);
  const [memos, setMemos] = useState(initMemos);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');
  const [isEnding, setIsEnding] = useState(false);

  const colorMap = React.useMemo(() => {
    const map = {};
    travelers.forEach((t) => (map[String(t.id)] = t.color));
    return map;
  }, [travelers]);

  const sharedOps = useItemOperations(tripId, 'shared', setShared, travelers, colorMap);
  const personalOps = useItemOperations(tripId, 'personal', setPersonal, travelers, colorMap);
  const necessityOps = useItemOperations(tripId, 'necessity', setNecessity, travelers, colorMap);
  const activitiesOps = useItemOperations(tripId, 'activities', setActivities, travelers, colorMap);

  const getOperations = (key) => {
    if (key === 'shared') return sharedOps;
    if (key === 'personal') return personalOps;
    if (key === 'necessity') return necessityOps;
    if (key === 'activities') return activitiesOps;
    return null;
  };

  const loadMembersAndItems = useCallback(async () => {
    if (!tripId) return;
    try {
      const results = await Promise.allSettled([
        getTripMembers(tripId),
        getSharedItems(tripId),
        getPersonalItems(tripId),
        getTodos(tripId),
        getMemos(tripId),
        getActivities(tripId),
      ]);

      const memberRes = results[0].status === 'fulfilled' ? results[0].value : [];
      const rawMembers = memberRes.data || memberRes || [];
      const mappedMembers = rawMembers
        .slice()
        .sort((a, b) => b.isLeader - a.isLeader)
        .map((m, idx) => ({
          id: String(m.userId),
          name: m.nickname,
          color: COLOR_POOL[idx % COLOR_POOL.length],
          isLeader: !!m.isLeader,
        }));
      setTravelers(mappedMembers);

      const localColorMap = {};
      mappedMembers.forEach((t) => (localColorMap[String(t.id)] = t.color));
      const processList = (res, type) =>
        Array.isArray(res)
          ? res.map((item) => transformToUiModel(item, type, mappedMembers, localColorMap))
          : [];

      setShared(
        processList(
          results[1].status === 'fulfilled' ? results[1].value?.data || results[1].value : [],
          'shared',
        ),
      );
      setPersonal(
        processList(
          results[2].status === 'fulfilled' ? results[2].value?.data || results[2].value : [],
          'personal',
        ),
      );
      setNecessity(
        processList(
          results[3].status === 'fulfilled' ? results[3].value?.data || results[3].value : [],
          'necessity',
        ),
      );

      const memoRes =
        results[4].status === 'fulfilled'
          ? results[4].value?.data?.memos || results[4].value?.memos
          : [];
      setMemos(
        Array.isArray(memoRes)
          ? memoRes.map((m) => ({
              id: String(m.id),
              title: m.title,
              content: m.content,
              updatedAt: m.updatedAt,
            }))
          : [],
      );

      setActivities(
        processList(
          results[5].status === 'fulfilled' ? results[5].value?.data || results[5].value : [],
          'activities',
        ),
      );
    } catch (e) {
      console.error(e);
    }
  }, [tripId]);

  useFocusEffect(
    useCallback(() => {
      loadMembersAndItems();
    }, [loadMembersAndItems]),
  );

useEffect(() => {
  if (trip) {
    AsyncStorage.setItem('@current_trip_data', JSON.stringify(trip))
      .catch(e => console.error('[OnTrip] trip 저장 실패:', e));
  }

  return () => {
  };
}, [trip]);

  const addItem = async (setter, list, sectionKey) => {
    if (!text.trim()) return;
    setText('');
    setAdding(null);
    await getOperations(sectionKey)?.create(text.trim());
  };

  const deleteItem = (list, setter, index, sectionKey) => {
    const item = list[index];
    if (!item.id || String(item.id).startsWith('temp-')) {
      Alert.alert('오류', '유효하지 않은 항목입니다.');
      return;
    }
    getOperations(sectionKey)?.remove(item.id);
  };

  const editItem = (list, setter, index, value, sectionKey) =>
    getOperations(sectionKey)?.update(list[index].id, { title: value });

  const toggleCheck = (list, setter, index, sectionKey) =>
    getOperations(sectionKey)?.toggleCheck(list[index].id, list[index].checked);

  const assignTraveler = (list, setter, index, sectionKey) => {
    const item = list[index];
    if (!item.id || String(item.id).startsWith('temp-')) return;
    getOperations(sectionKey)?.toggleAssign(item.id, !!item.travelerId);
  };

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
            await AsyncStorage.removeItem(ONGOING_TRIP_KEY);
            await AsyncStorage.removeItem('@current_trip_data');
            Toast.show({
              type: 'success',
              text1: '여행이 종료되었습니다',
              text2: '즐거운 추억 되셨나요? 😊',
            });
            navigation.navigate('EndTrip', { trip });
          } catch (e) {
            Alert.alert('실패', '여행 종료에 실패했습니다.');
          } finally {
            setIsEnding(false);
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
            <TravelerAvatar key={t.id} name={t.name} color={t.color} showDelete={false} />
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
          addItem: (setter, list) => addItem(setter, list, 'necessity'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'necessity'),
          editItem: (list, setter, index, value) =>
            editItem(list, setter, index, value, 'necessity'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'necessity'),
          assignTraveler: (list, setter, index) => assignTraveler(list, setter, index, 'necessity'),
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
          addItem: (setter, list) => addItem(setter, list, 'shared'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'shared'),
          editItem: (list, setter, index, value) => editItem(list, setter, index, value, 'shared'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'shared'),
          assignTraveler: (list, setter, index) => assignTraveler(list, setter, index, 'shared'),
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
          addItem: (setter, list) => addItem(setter, list, 'personal'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'personal'),
          editItem: (list, setter, index, value) =>
            editItem(list, setter, index, value, 'personal'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'personal'),
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
          addItem: (setter, list) => addItem(setter, list, 'activities'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'activities'),
          editItem: (list, setter, index, value) =>
            editItem(list, setter, index, value, 'activities'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'activities'),
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
                  tripId,
                  memo,
                  onSave: (u) => setMemos((p) => p.map((m) => (m.id === u.id ? u : m))),
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
                  setMemos((p) => p.filter((m) => m.id !== memo.id));
                } catch (e) {}
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
                onSave: (n) => setMemos((p) => [...p, n]),
              })
            }
          >
            <Plus width={24} height={24} />
          </Pressable>
        </View>
        <View style={sharedStyles.sectionDivider} />
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
  endButtonWrapper: { marginTop: 16 },
  endButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 100,
    marginVertical: 20,
  },
  endButtonDisabled: { opacity: 0.6 },
  endButtonText: { color: colors.grayscale[100], fontSize: 16, fontFamily: 'Pretendard-SemiBold' },
});
