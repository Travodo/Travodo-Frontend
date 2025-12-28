import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { colors } from '../../styles/colors';
import { renderSection } from '../../utils/renderSection';
import sharedStyles from './sharedStyles';

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
  getTripInviteCode,
  regenerateInviteCode,
  updateTripStatus,
  deleteTrip,
} from '../../services/api';

const SECTION_NAMES = {
  shared: '공동 준비물',
  personal: '개인 준비물',
  necessity: '필수 할 일',
  activities: '여행 활동',
};
const ONGOING_TRIP_KEY = '@ongoing_trip_status';
const COLOR_POOL = ['#769FFF', '#FFE386', '#EE8787', '#A4C664'];

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// API Adapter
// -------------------------------------------------------------------------
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
    assign: assignSharedItem, // 토큰 기반 자동 할당
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
    assign: assignTodo, // 토큰 기반 자동 할당 (ID 파라미터 제거)
    unassign: unassignTodo,
  },
  activities: {
    create: (tripId, text) => createActivity(tripId, { title: text }),
    update: async (tripId, id, data) => {
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
      return updateActivityContent(tripId, Number(id), { title: data.title });
    },
    delete: (tripId, id) => deleteActivity(tripId, Number(id)),
  },
};

// -------------------------------------------------------------------------
// Hooks
// -------------------------------------------------------------------------
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
        // 본인 자동 할당이므로 타겟 ID 없이 호출
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

// -------------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------------
function PrepareScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const trip = route?.params?.tripData;
  const tripId = trip?.id;

  const [travelers, setTravelers] = useState([]);
  const [necessity, setNecessity] = useState([]);
  const [shared, setShared] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [activities, setActivities] = useState([]);
  const [memos, setMemos] = useState([]);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');
  const [inviting, setInviting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasOngoingTrip, setHasOngoingTrip] = useState(false);

  const colorMap = React.useMemo(() => {
    const map = {};
    travelers.forEach((t) => (map[String(t.id)] = t.color));
    return map;
  }, [travelers]);

  const sharedOps = useItemOperations(tripId, 'shared', setShared, travelers, colorMap);
  const personalOps = useItemOperations(tripId, 'personal', setPersonal, travelers, colorMap);
  const necessityOps = useItemOperations(tripId, 'necessity', setNecessity, travelers, colorMap);
  const activitiesOps = useItemOperations(tripId, 'activities', setActivities, travelers, colorMap);

  const fetchAllData = useCallback(async () => {
    if (!tripId) return;
    try {
      const stored = await getOngoingTripFromStorage();
      setHasOngoingTrip(stored.isOngoing && String(stored.tripId) !== String(tripId));
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
      fetchAllData();
    }, [fetchAllData]),
  );

  const getOperations = (key) => {
    if (key === 'shared') return sharedOps;
    if (key === 'personal') return personalOps;
    if (key === 'necessity') return necessityOps;
    if (key === 'activities') return activitiesOps;
    return null;
  };

  const addItem = async (setter, list, key) => {
    if (!text.trim()) return;
    setText('');
    setAdding(null);
    await getOperations(key)?.create(text.trim());
  };

  const deleteItem = (list, setter, idx, key) => {
    const item = list[idx];
    if (!item.id || String(item.id).startsWith('temp-')) {
      Alert.alert('오류', '유효하지 않은 항목입니다.');
      return;
    }
    getOperations(key)?.remove(item.id);
  };

  const editItem = (list, setter, idx, val, key) =>
    getOperations(key)?.update(list[idx].id, { title: val });
  const toggleCheck = (list, setter, idx, key) =>
    getOperations(key)?.toggleCheck(list[idx].id, list[idx].checked);

  // 클릭 시 즉시 토큰 기반 할당/해제
  const assignTraveler = (list, setter, idx, key) => {
    const item = list[idx];
    if (!item.id || String(item.id).startsWith('temp-')) return;
    getOperations(key)?.toggleAssign(item.id, !!item.travelerId);
  };

  const handleInviteAction = useCallback(
    async (actionType) => {
      if (!tripId || inviting) return;
      setInviting(true);
      try {
        const apiCall = actionType === 'regenerate' ? regenerateInviteCode : getTripInviteCode;
        const res = await apiCall(tripId);
        const code = res?.inviteCode ?? res?.code;
        if (!code) throw new Error('No code');
        await Clipboard.setStringAsync(String(code).trim());
        Toast.show({
          type: 'success',
          text1: '초대코드 복사 완료',
          text2: '클립보드에 복사했어요.',
        });
      } catch (e) {
        Alert.alert('실패', e?.response?.status === 403 ? '방장만 가능합니다.' : '코드 조회 실패');
      } finally {
        setInviting(false);
      }
    },
    [tripId, inviting],
  );

  const openInviteActions = useCallback(() => {
    Alert.alert('초대하기', '초대코드를 공유하세요', [
      { text: '코드 복사', onPress: () => handleInviteAction('fetch') },
      { text: '재발급', onPress: () => handleInviteAction('regenerate'), style: 'destructive' },
      { text: '취소', style: 'cancel' },
    ]);
  }, [handleInviteAction]);

  const handleStartTrip = async () => {
  if (!tripId) return;
  setIsStarting(true);
  try {
    const stored = await getOngoingTripFromStorage();
    if (stored.isOngoing && String(stored.tripId) !== String(tripId)) {
      Alert.alert('시작 불가', '다른 여행이 진행 중입니다.');
      setHasOngoingTrip(true);
      return;
    }
    await updateTripStatus(tripId, 'ONGOING');
    await setOngoingTripInStorage(true, String(tripId));
    
    await AsyncStorage.setItem('@current_trip_data', JSON.stringify(trip));
    
    Toast.show({ type: 'success', text1: '여행 시작!', text2: '즐거운 여행 되세요 🎉' });
    
    // ✅ 여기를 수정!
    navigation.navigate('StartTrip', {  // OnTrip → StartTrip
      trip,
      travelers,
      necessity,
      shared,
      personal,
      activities,
      memos,
    });
  } catch (e) {
    Alert.alert('실패', e.response?.data?.message || '시작 실패');
  } finally {
    setIsStarting(false);
  }
};

  const handleDeleteAllData = async () => {
    if (!tripId) return;
    try {
      navigation.goBack();
      await deleteTrip(tripId);
      Alert.alert('여행 삭제가 완료되었습니다.');
    } catch (e) {
      Alert.alert('실패', '일부 데이터 삭제 실패');
    }
  };

  if (!trip)
    return (
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.pageTitle}>여행 정보 없음</Text>
      </View>
    );

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.pageTitle}>여행 준비 리스트</Text>
      <Text style={sharedStyles.subTitle}>신나는 여행을 준비해 봐요!</Text>
      <View style={sharedStyles.fixedCard}>
        <TripCard trip={trip} hideActions={true} />
      </View>
      <ScrollView contentContainerStyle={sharedStyles.content}>
        <View style={styles.sectionTitleRow}>
          <Text style={sharedStyles.sectionTitle}>여행자</Text>
          <Pressable
            onPress={openInviteActions}
            disabled={!tripId || inviting}
            style={({ pressed }) => [
              styles.invitePlusButton,
              (pressed || inviting) && styles.invitePlusButtonPressed,
              (!tripId || inviting) && styles.invitePlusButtonDisabled,
            ]}
          >
            <MaterialIcons name="add" size={22} color={colors.primary[700]} />
          </Pressable>
        </View>
        <View style={styles.travelerRow}>
          {travelers.length === 0 ? (
            <Text style={{ color: colors.grayscale[600], fontFamily: 'Pretendard-Regular' }}>
              아직 참가한 여행자가 없어요.
            </Text>
          ) : (
            <View style={sharedStyles.travelerList}>
              {travelers.map((t) => (
                <TravelerAvatar key={t.id} name={t.name} color={t.color} showDelete={false} />
              ))}
            </View>
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
          addItem: (s, l) => addItem(s, l, 'necessity'),
          deleteItem: (l, s, i) => deleteItem(l, s, i, 'necessity'),
          editItem: (l, s, i, n) => editItem(l, s, i, n, 'necessity'),
          toggleCheck: (l, s, i) => toggleCheck(l, s, i, 'necessity'),
          assignTraveler: (l, s, i) => assignTraveler(l, s, i, 'necessity'),
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
          addItem: (s, l) => addItem(s, l, 'shared'),
          deleteItem: (l, s, i) => deleteItem(l, s, i, 'shared'),
          editItem: (l, s, i, n) => editItem(l, s, i, n, 'shared'),
          toggleCheck: (l, s, i) => toggleCheck(l, s, i, 'shared'),
          assignTraveler: (l, s, i) => assignTraveler(l, s, i, 'shared'),
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
          addItem: (s, l) => addItem(s, l, 'personal'),
          deleteItem: (l, s, i) => deleteItem(l, s, i, 'personal'),
          editItem: (l, s, i, n) => editItem(l, s, i, n, 'personal'),
          toggleCheck: (l, s, i) => toggleCheck(l, s, i, 'personal'),
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
          addItem: (s, l) => addItem(s, l, 'activities'),
          deleteItem: (l, s, i) => deleteItem(l, s, i, 'activities'),
          editItem: (l, s, i, n) => editItem(l, s, i, n, 'activities'),
          toggleCheck: (l, s, i) => toggleCheck(l, s, i, 'activities'),
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
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.startButton,
              (isStarting || hasOngoingTrip) && styles.startButtonDisabled,
            ]}
            disabled={isStarting || hasOngoingTrip}
            onPress={handleStartTrip}
          >
            <Text style={styles.startText}>
              {isStarting ? '시작 중...' : hasOngoingTrip ? '다른 여행 진행 중' : '여행 시작'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert('확인', '전체 삭제하시겠습니까?', [
                { text: '취소' },
                { text: '삭제', style: 'destructive', onPress: handleDeleteAllData },
              ])
            }
          >
            <Text style={styles.deleteText}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invitePlusButton: {
    padding: 4,
    borderRadius: 20,
  },
  invitePlusButtonPressed: {
    backgroundColor: colors.grayscale[100],
  },
  invitePlusButtonDisabled: {
    opacity: 0.5,
  },
  travelerRow: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.primary[700],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startText: {
    color: colors.grayscale[100],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.grayscale[200],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.grayscale[700],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export { clearOngoingTripFromStorage };
export default PrepareScreen;
