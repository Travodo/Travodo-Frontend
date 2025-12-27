import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  assignSharedItem,
  createSharedItem,
  deleteSharedItem,
  getSharedItems,
  getTripInviteCode,
  getTripMembers,
  regenerateInviteCode,
  unassignSharedItem,
  updateSharedItem,
  getPersonalItems,
  createPersonalItem,
  updatePersonalItem,
  deletePersonalItem,
  getMemos,
  createMemo,
  deleteMemo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  assignTodo,
  unassignTodo,
  updateTripStatus,
  deleteTrip,
  getOngoingTrips
} from '../../services/api';

const TODO_CATEGORY = {
  NECESSITY: 'NECESSITY',
  ACTIVITY: 'ACTIVITY',
};

const SECTION_NAMES = {
  shared: '공동 준비물',
  personal: '개인 준비물',
  necessity: '필수 할 일',
  activities: '여행 활동',
};

const ONGOING_TRIP_KEY = '@ongoing_trip_status';

const setOngoingTripInStorage = async (isOngoing, tripId = null) => {
  try {
    await AsyncStorage.setItem(
      ONGOING_TRIP_KEY,
      JSON.stringify({ isOngoing, tripId })
    );
  } catch (e) {
    console.error('진행 중인 여행 상태 저장 실패:', e);
  }
};


const getOngoingTripFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(ONGOING_TRIP_KEY);
    if (value) {
      return JSON.parse(value);
    }
    return { isOngoing: false, tripId: null };
  } catch (e) {
    console.error('진행 중인 여행 상태 조회 실패:', e);
    return { isOngoing: false, tripId: null };
  }
};

const clearOngoingTripFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(ONGOING_TRIP_KEY);
  } catch (e) {
    console.error('진행 중인 여행 상태 삭제 실패:', e);
  }
};

const API_MAP = {
  shared: {
    create: createSharedItem,
    update: updateSharedItem,
    delete: deleteSharedItem,
    assign: assignSharedItem,
    unassign: unassignSharedItem,
  },
  personal: {
    create: createPersonalItem,
    update: updatePersonalItem,
    delete: deletePersonalItem,
  },
  necessity: {
    create: (tripId, data) => createTodo(tripId, { ...data, category: TODO_CATEGORY.NECESSITY }),
    update: (tripId, id, data) => updateTodo(tripId, id, { ...data, category: TODO_CATEGORY.NECESSITY }),
    delete: deleteTodo,
    assign: assignTodo,
    unassign: unassignTodo,
  },
  activities: {
    create: (tripId, data) => createTodo(tripId, { ...data, category: TODO_CATEGORY.ACTIVITY }),
    update: (tripId, id, data) => updateTodo(tripId, id, { ...data, category: TODO_CATEGORY.ACTIVITY }),
    delete: deleteTodo,
  },
};

const normalizeItem = (item, sectionKey, travelers = []) => {
  const base = {
    id: String(item.id),
    content: item.name,
    checked: !!item.checked,
  };

  if (['shared', 'necessity'].includes(sectionKey)) {
    return {
      ...base,
      travelerId: item.assigneeId != null ? String(item.assigneeId) : null,
      travelerName: item.assigneeName ?? null,
      travelerColor:
        item.assigneeId != null
          ? travelers.find((t) => String(t.id) === String(item.assigneeId))?.color ?? null
          : null,
    };
  }

  return {
    ...base,
    travelerId: null,
    travelerName: null,
    travelerColor: null,
  };
};


const normalizeMembers = (members, colorPool) => {
  return (members || [])
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
};

const createColorMap = (travelers) => {
  const colorMap = {};
  travelers.forEach((t) => {
    colorMap[String(t.id)] = t.color;
  });
  return colorMap;
};

const useItemOperations = (tripId, sectionKey, setter, travelers) => {
  const apiMethods = API_MAP[sectionKey];

  const create = useCallback(
    async (text) => {
      if (!text.trim()) return;

      try {
        const created = await apiMethods.create(tripId, { name: text.trim() });
        setter((prev) => [...prev, normalizeItem(created, sectionKey, travelers)]);
        return created;
      } catch (e) {
        console.error(`${SECTION_NAMES[sectionKey]} 생성 실패:`, e);
        Alert.alert('실패', `${SECTION_NAMES[sectionKey]} 추가에 실패했습니다.`);
        throw e;
      }
    },
    [tripId, sectionKey, setter, travelers, apiMethods]
  );

  const update = useCallback(
    async (itemId, updates) => {
      try {
        const updated = await apiMethods.update(tripId, itemId, updates);
        setter((prev) =>
          prev.map((item) =>
            String(item.id) === String(itemId)
              ? normalizeItem(updated, sectionKey, travelers)
              : item
          )
        );
        return updated;
      } catch (e) {
        console.error(`${SECTION_NAMES[sectionKey]} 수정 실패:`, e);
        Alert.alert('실패', `${SECTION_NAMES[sectionKey]} 수정에 실패했습니다.`);
        throw e;
      }
    },
    [tripId, sectionKey, setter, travelers, apiMethods]
  );

  const remove = useCallback(
    async (itemId) => {
      try {
        await apiMethods.delete(tripId, itemId);
        setter((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
      } catch (e) {
        console.error(`${SECTION_NAMES[sectionKey]} 삭제 실패:`, e);
        Alert.alert('실패', `${SECTION_NAMES[sectionKey]} 삭제에 실패했습니다.`);
        throw e;
      }
    },
    [tripId, sectionKey, setter, apiMethods]
  );

  const toggleCheck = useCallback(
    async (itemId, currentChecked) => {
      try {
        await update(itemId, { checked: !currentChecked });
      } catch (e) {
        console.error('체크 상태 변경 실패:', e);
        Alert.alert('실패', '체크 상태 변경에 실패했습니다.');
      }
    },
    [update]
  );

  const toggleAssign = useCallback(
    async (itemId, isCurrentlyAssigned) => {
      if (!apiMethods.assign || !apiMethods.unassign) {
        return; 
      }

      try {
        const method = isCurrentlyAssigned ? apiMethods.unassign : apiMethods.assign;
        const updated = await method(tripId, itemId);
        setter((prev) =>
          prev.map((item) =>
            String(item.id) === String(itemId)
              ? normalizeItem(updated, sectionKey, travelers)
              : item
          )
        );
      } catch (e) {
        console.error('담당자 변경 실패:', e);
        Alert.alert('안내', '담당자 지정/해제는 본인만 할 수 있습니다.');
        throw e;
      }
    },
    [tripId, sectionKey, setter, travelers, apiMethods]
  );

  return {
    create,
    update,
    remove,
    toggleCheck,
    toggleAssign,
  };
};

function PrepareScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const trip = route?.params?.tripData;
  const tripId = trip?.id;

  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const selectedTravelerRef = useRef(null);

  const colorPool = React.useMemo(
    () => ['#769FFF', '#FFE386', '#EE8787', '#A4C664'],
    []
  );

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

  const sharedOps = useItemOperations(tripId, 'shared', setShared, travelers);
  const personalOps = useItemOperations(tripId, 'personal', setPersonal, travelers);
  const necessityOps = useItemOperations(tripId, 'necessity', setNecessity, travelers);
  const activitiesOps = useItemOperations(tripId, 'activities', setActivities, travelers);

  const loadMembersAndShared = useCallback(async () => {
    if (!tripId) return [];

    try {
      const membersResponse = await getTripMembers(tripId);
      const members = membersResponse?.data || membersResponse || [];
      const mappedMembers = normalizeMembers(members, colorPool);
      const colorMap = createColorMap(mappedMembers);

      const [sharedItemsResponse, personalItemsResponse] = await Promise.all([
        getSharedItems(tripId),
        getPersonalItems(tripId),
      ]);
      
      const sharedItems = sharedItemsResponse?.data || sharedItemsResponse || [];
      const personalItems = personalItemsResponse?.data || personalItemsResponse || [];

      const mappedShared = (Array.isArray(sharedItems) ? sharedItems : []).map((it) => ({
        id: String(it.id),
        content: it.name,
        checked: !!it.checked,
        travelerId: it.assigneeId != null ? String(it.assigneeId) : null,
        travelerName: it.assigneeName ?? null,
        travelerColor:
          it.assigneeId != null ? colorMap[String(it.assigneeId)] ?? null : null,
      }));

      const mappedPersonal = (Array.isArray(personalItems) ? personalItems : []).map((it) => ({
        id: String(it.id),
        content: it.name,
        checked: !!it.checked,
        travelerId: null,
        travelerName: null,
        travelerColor: null,
      }));

      setTravelers(mappedMembers);
      setShared(mappedShared);
      setPersonal(mappedPersonal);
      
      return mappedMembers; 
    } catch (e) {
      console.error('여행 멤버 / 준비물 조회 실패:', e);
      setTravelers([]);
      setShared([]);
      setPersonal([]);
      return [];
    }
  }, [tripId, colorPool]);

  const loadTodos = useCallback(async (currentTravelers = []) => {
    if (!tripId) return;

    try {
      const response = await getTodos(tripId);
      const data = response?.data || response || [];
      
      if (!Array.isArray(data)) {
        console.warn('Todo 데이터가 배열이 아님:', data);
        setNecessity([]);
        setActivities([]);
        return;
      }
      
      const colorMap = createColorMap(currentTravelers);

      const normalize = (it) => ({
        id: String(it.id),
        content: it.name,
        checked: !!it.checked,
        travelerId: it.assigneeId != null ? String(it.assigneeId) : null,
        travelerName: it.assigneeName ?? null,
        travelerColor:
          it.assigneeId != null ? colorMap[String(it.assigneeId)] ?? null : null,
        category: it.category ?? it.type ?? null,
      });

      const list = data.map(normalize);

      setNecessity(list.filter((x) => x.category === TODO_CATEGORY.NECESSITY));
      setActivities(list.filter((x) => x.category === TODO_CATEGORY.ACTIVITY));
    } catch (e) {
      console.error('Todo(필수/활동) 조회 실패:', e);
      setNecessity([]);
      setActivities([]);
    }
  }, [tripId]);

  const loadMemos = useCallback(async () => {
    if (!tripId) return;
    try {
      const response = await getMemos(tripId);
      const data = response?.data || response || [];
      
      if (!Array.isArray(data)) {
        console.warn('메모 데이터가 배열이 아님:', data);
        setMemos([]);
        return;
      }
      
      setMemos(
        data.map((m) => ({
          id: String(m.id),
          title: m.title,
          content: m.content,
          updatedAt: m.updatedAt,
        }))
      );
    } catch (e) {
      console.error('메모 조회 실패', e);
      setMemos([]);
    }
  }, [tripId]);

useFocusEffect(
  useCallback(() => {
    (async () => {
      const serverOngoing = await getOngoingTrips();

      if (!serverOngoing || serverOngoing.length === 0) {
        await clearOngoingTripFromStorage();
        setHasOngoingTrip(false);
      } else {
        const ongoingTripId = String(serverOngoing[0].id);
        await setOngoingTripInStorage(true, ongoingTripId);
        setHasOngoingTrip(ongoingTripId !== String(tripId));
      }

      const currentTravelers = await loadMembersAndShared();
      await loadTodos(currentTravelers);
      await loadMemos();
    })();
  }, [tripId])
);


  const copyInviteCodeToClipboard = useCallback(async (code) => {
    const safe = String(code || '').trim();
    if (!safe) return;
    await Clipboard.setStringAsync(safe);
    Toast.show({
      type: 'success',
      text1: '초대코드 복사 완료',
      text2: '클립보드에 복사했어요.',
      text1Style: { fontSize: 16 },
      text2Style: { fontSize: 13 },
    });
  }, []);

  const fetchAndCopyInviteCode = useCallback(async () => {
    if (!tripId || inviting) return;
    try {
      setInviting(true);
      const res = await getTripInviteCode(tripId);
      const code = res?.inviteCode;
      if (!code) {
        Alert.alert('실패', '초대코드를 가져오지 못했습니다.');
        return;
      }

      if (res?.expired) {
        Alert.alert(
          '초대코드 만료',
          '현재 초대코드가 만료되었습니다. 방장이 재발급해야 참가할 수 있어요.',
          [
            {
              text: '재발급 후 복사',
              onPress: () => regenerateAndCopyInviteCode(),
              style: 'destructive',
            },
            { text: '취소', style: 'cancel' },
          ]
        );
        return;
      }

      await copyInviteCodeToClipboard(code);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) {
        Alert.alert('안내', '여행 멤버만 초대코드를 조회할 수 있어요.');
        return;
      }
      console.error('초대코드 조회/복사 실패:', e);
      Alert.alert('실패', '초대코드 조회에 실패했습니다.');
    } finally {
      setInviting(false);
    }
  }, [tripId, inviting, copyInviteCodeToClipboard]);

  const regenerateAndCopyInviteCode = useCallback(async () => {
    if (!tripId || inviting) return;
    try {
      setInviting(true);
      const res = await regenerateInviteCode(tripId);
      const code = res?.inviteCode ?? res?.code ?? res;
      if (!code) {
        Alert.alert('실패', '초대코드를 재발급하지 못했습니다.');
        return;
      }
      await copyInviteCodeToClipboard(code);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) {
        Alert.alert('안내', '초대코드 재발급은 여행 방장만 할 수 있어요.');
        return;
      }
      console.error('초대코드 재발급/복사 실패:', e);
      Alert.alert('실패', '초대코드 재발급에 실패했습니다.');
    } finally {
      setInviting(false);
    }
  }, [tripId, inviting, copyInviteCodeToClipboard]);

  const openInviteActions = useCallback(() => {
    Alert.alert('여행자 추가', '초대코드를 복사해서 친구에게 보내주세요.', [
      { text: '초대코드 복사', onPress: fetchAndCopyInviteCode },
      {
        text: '재발급 후 복사',
        onPress: regenerateAndCopyInviteCode,
        style: 'destructive',
      },
      { text: '취소', style: 'cancel' },
    ]);
  }, [fetchAndCopyInviteCode, regenerateAndCopyInviteCode]);

  const getOperations = (sectionKey) => {
    switch (sectionKey) {
      case 'shared':
        return sharedOps;
      case 'personal':
        return personalOps;
      case 'necessity':
        return necessityOps;
      case 'activities':
        return activitiesOps;
      default:
        return null;
    }
  };

  const addItem = async (setter, list, sectionKey) => {
    if (!text.trim()) return;

    const ops = getOperations(sectionKey);
    if (!ops) return;

    try {
      await ops.create(text.trim());
      setText('');
      setAdding(null);
    } catch (e) {
    }
  };

  const deleteItem = async (list, setter, index, sectionKey) => {
    const item = list[index];
    const ops = getOperations(sectionKey);
    if (!ops) return;

    try {
      await ops.remove(item.id);
    } catch (e) {
    }
  };

  const editItem = async (list, setter, index, newContent, sectionKey) => {
    const item = list[index];
    const ops = getOperations(sectionKey);
    if (!ops) return;

    try {
      await ops.update(item.id, { name: newContent });
    } catch (e) {
    }
  };

  const toggleCheck = async (list, setter, index, sectionKey) => {
    const item = list[index];
    const ops = getOperations(sectionKey);
    if (!ops) return;

    try {
      await ops.toggleCheck(item.id, item.checked);
    } catch (e) {
    }
  };

  const assignTraveler = async (list, setter, index, sectionKey) => {
    const item = list[index];
    const ops = getOperations(sectionKey);
    if (!ops) return;

    try {
      await ops.toggleAssign(item.id, !!item.travelerId);
    } catch (e) {
    }
  };

  const handleStartTrip = async (tripId) => {
    if (!tripId) {
      Alert.alert('오류', '여행 ID를 찾을 수 없습니다.');
      return;
    }

    setIsStarting(true);
    try {
      console.log('[PrepareScreen] 여행 시작 요청 - tripId:', tripId);

      await updateTripStatus(tripId, 'ONGOING');
      console.log('[PrepareScreen] 서버 상태 변경 완료');

      await setOngoingTripInStorage(true, String(tripId));
      console.log('[PrepareScreen] AsyncStorage 저장 완료');

      Toast.show({
        type: 'success',
        text1: '여행이 시작되었습니다!',
        text2: '즐거운 여행 되세요 🎉',
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 13 },
      });
    } catch (error) {
      console.error('[PrepareScreen] 여행 상태 변경 실패:', error);
      Alert.alert(
        '실패',
        error.response?.data?.message || '여행 상태 변경에 실패했습니다.'
      );
      throw error;
    } finally {
      setIsStarting(false);
    }
  };

  const handleDeleteAllData = async () => {
    if (!tripId) {
      Alert.alert('실패', 'tripId가 없습니다');
      return;
    }

    try {
      await Promise.all([
        ...necessity.map((item) => deleteTodo(tripId, item.id)),
        ...activities.map((item) => deleteTodo(tripId, item.id)),
        ...shared.map((item) => deleteSharedItem(tripId, item.id)),
        ...personal.map((item) => deletePersonalItem(tripId, item.id)),
        ...memos.map((memo) => deleteMemo(tripId, memo.id)),
      ]);

      setNecessity([]);
      setActivities([]);
      setShared([]);
      setPersonal([]);
      setMemos([]);

      Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
    } catch (e) {
      console.error('전체 삭제 실패:', e);
      Alert.alert(
        '실패',
        '일부 데이터 삭제에 실패했습니다.\n네트워크 상태를 확인해주세요.'
      );
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(tripId);
      await clearOngoingTripFromStorage();
      setTravelers([]);
      setNecessity([]);
      setShared([]);
      setPersonal([]);
      setActivities([]);
      setMemos([]);
      navigation.goBack();
    } catch (error) {
      console.error('삭제 실패', error);
    }
  };

  if (!trip) {
    return (
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.pageTitle}>여행 정보를 불러올 수 없습니다</Text>
      </View>
    );
  }

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
            hitSlop={8}
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
            <Text
              style={{ color: colors.grayscale[600], fontFamily: 'Pretendard-Regular' }}
            >
              아직 참가한 여행자가 없어요.
            </Text>
          ) : (
            <View style={sharedStyles.travelerList}>
              {travelers.map((t) => (
                <TravelerAvatar
                  key={t.id}
                  name={t.name}
                  color={t.color}
                  selected={selectedTraveler === t.id}
                  onPress={() => {
                    const next = selectedTraveler === t.id ? null : t.id;
                    selectedTravelerRef.current = next;
                    setSelectedTraveler(next);
                  }}
                  showDelete={false}
                />
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
          addItem: (setter, list) => addItem(setter, list, 'necessity'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'necessity'),
          editItem: (list, setter, index, newContent) =>
            editItem(list, setter, index, newContent, 'necessity'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'necessity'),
          assignTraveler: (list, setter, index) =>
            assignTraveler(list, setter, index, 'necessity'),
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
          editItem: (list, setter, index, newContent) =>
            editItem(list, setter, index, newContent, 'shared'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'shared'),
          assignTraveler: (list, setter, index) =>
            assignTraveler(list, setter, index, 'shared'),
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
          editItem: (list, setter, index, newContent) =>
            editItem(list, setter, index, newContent, 'personal'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'personal'),
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
          addItem: (setter, list) => addItem(setter, list, 'activities'),
          deleteItem: (list, setter, index) => deleteItem(list, setter, index, 'activities'),
          editItem: (list, setter, index, newContent) =>
            editItem(list, setter, index, newContent, 'activities'),
          toggleCheck: (list, setter, index) => toggleCheck(list, setter, index, 'activities'),
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
                  onSave: (updatedMemo) => {
                    setMemos((prev) =>
                      prev.map((m) => (m.id === updatedMemo.id ? updatedMemo : m))
                    );
                  },
                })
              }
            >
              <MaterialIcons name="description" size={22} color={colors.grayscale[500]} />
              <Text style={sharedStyles.memoText}>{memo.title}</Text>
            </Pressable>

            <Pressable
              hitSlop={8}
              onPress={async () => {
                try {
                  await deleteMemo(tripId, memo.id);
                  setMemos((prev) => prev.filter((m) => m.id !== memo.id));
                } catch (e) {
                  Alert.alert('실패', '메모 삭제에 실패했습니다.');
                }
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={colors.grayscale[600]}
              />
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
            style={[
              styles.startButton,
              (isStarting || hasOngoingTrip) && styles.startButtonDisabled,
            ]}
            disabled={isStarting || hasOngoingTrip}
            onPress={async () => {
  if (!tripId) {
    Alert.alert('오류', '여행 정보를 찾을 수 없습니다.');
    return;
  }

  try {
    setIsStarting(true);
    await handleStartTrip(tripId);
    setHasOngoingTrip(true);

    navigation.navigate('OnTripScreen', {
      trip,
      travelers,
      necessity,
      shared,
      personal,
      activities,
      memos,
    });
  } catch (error) {
    console.error('여행 시작 실패:', error);
  } finally {
    setIsStarting(false);
  }
}}
          >
            <Text style={styles.startText}>
              {isStarting
                ? '시작 중...'
                : hasOngoingTrip
                ? '다른 여행 진행 중'
                : '여행 시작'}
            </Text>
          </TouchableOpacity>

          {/* 삭제 버튼 */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                '확인',
                '모든 데이터를 삭제하시겠습니까?\n(서버에 저장된 데이터도 함께 삭제됩니다)',
                [
                  { text: '취소', style: 'cancel' },
                  {
                    text: '삭제',
                    style: 'destructive',
                    onPress: handleDeleteAllData,
                  },
                ]
              );
            }}
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
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.grayscale[300],
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