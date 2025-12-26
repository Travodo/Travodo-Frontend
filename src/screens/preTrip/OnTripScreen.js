import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import { renderSection } from '../../utils/renderSection';
import { colors } from '../../styles/colors';
import sharedStyles from './sharedStyles';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import {
  assignSharedItem,
  createSharedItem,
  deleteSharedItem,
  getSharedItems,
  getTripMembers,
  unassignSharedItem,
  updateSharedItem,
  updateTripStatus,
} from '../../services/api';

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

  const tripId = trip?.id;
  const colorPool = ['#769FFF', '#FFE386', '#EE8787', '#A4C664'];

  const loadMembersAndShared = useCallback(async () => {
    if (!tripId) return;
    try {
      const members = await getTripMembers(tripId);
      const mappedMembers = (members || [])
        .slice()
        .sort((a, b) => {
          if (a.isLeader && !b.isLeader) return -1;
          if (!a.isLeader && b.isLeader) return 1;
          return String(a.nickname || '').localeCompare(String(b.nickname || ''));
        })
        .map((m, idx) => ({
          id: m.userId,
          name: m.nickname,
          color: colorPool[idx % colorPool.length],
          isLeader: !!m.isLeader,
        }));
      const nextColorMap = {};
      mappedMembers.forEach((t) => {
        nextColorMap[String(t.id)] = t.color;
      });

      const items = await getSharedItems(tripId);
      const mappedShared = (items || []).map((it) => ({
        id: String(it.id),
        content: it.name,
        checked: !!it.checked,
        travelerId: it.assigneeId != null ? String(it.assigneeId) : null,
        travelerName: it.assigneeName ?? null,
        travelerColor: it.assigneeId != null ? (nextColorMap[String(it.assigneeId)] ?? null) : null,
      }));

      setTravelers(mappedMembers);
      setShared(mappedShared);
    } catch (e) {
      console.error('여행 멤버/공동 준비물 조회 실패:', e);
    }
  }, [tripId]);

  useFocusEffect(
    useCallback(() => {
      loadMembersAndShared();
    }, [loadMembersAndShared]),
  );

  const addItem = (setter, list) => {
    if (!text.trim()) return;
    if (setter === setShared) {
      (async () => {
        try {
          const created = await createSharedItem(tripId, { name: text.trim() });
          setShared((prev) => [
            ...prev,
            {
              id: String(created?.id),
              content: created?.name ?? text.trim(),
              checked: !!created?.checked,
              travelerId: created?.assigneeId != null ? String(created.assigneeId) : null,
              travelerName: created?.assigneeName ?? null,
              travelerColor:
                created?.assigneeId != null
                  ? travelers.find((t) => String(t.id) === String(created.assigneeId))?.color ?? null
                  : null,
            },
          ]);
          setText('');
          setAdding(null);
        } catch (e) {
          console.error('공동 준비물 생성 실패:', e);
          Alert.alert('실패', '공동 준비물 추가에 실패했습니다.');
        }
      })();
      return;
    }
    setter([...list, { id: Date.now().toString(), content: text, checked: false }]);
    setText('');
    setAdding(null);
  };

  const deleteItem = (list, setter, index) => {
    const item = list[index];
    if (setter === setShared) {
      (async () => {
        try {
          await deleteSharedItem(tripId, item.id);
          setShared((prev) => prev.filter((x) => String(x.id) !== String(item.id)));
        } catch (e) {
          console.error('공동 준비물 삭제 실패:', e);
          Alert.alert('실패', '공동 준비물 삭제에 실패했습니다.');
        }
      })();
      return;
    }
    setter(list.filter((_, i) => i !== index));
  };

  const editItem = (list, setter, index, value) => {
    const item = list[index];
    if (setter === setShared) {
      (async () => {
        try {
          const updated = await updateSharedItem(tripId, item.id, { name: value });
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id)
                ? {
                    ...x,
                    content: updated?.name ?? value,
                    checked: !!updated?.checked,
                    travelerId: updated?.assigneeId != null ? String(updated.assigneeId) : null,
                    travelerName: updated?.assigneeName ?? null,
                    travelerColor:
                      updated?.assigneeId != null
                        ? travelers.find((t) => String(t.id) === String(updated.assigneeId))?.color ??
                          null
                        : null,
                  }
                : x,
            ),
          );
        } catch (e) {
          console.error('공동 준비물 수정 실패:', e);
          Alert.alert('실패', '공동 준비물 수정에 실패했습니다.');
        }
      })();
      return;
    }
    setter(list.map((it, i) => (i === index ? { ...it, content: value } : it)));
  };

  const toggleCheck = (list, setter, index) => {
    const item = list[index];
    if (setter === setShared) {
      (async () => {
        try {
          const updated = await updateSharedItem(tripId, item.id, { checked: !item.checked });
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id)
                ? {
                    ...x,
                    checked: !!updated?.checked,
                    travelerId: updated?.assigneeId != null ? String(updated.assigneeId) : null,
                    travelerName: updated?.assigneeName ?? null,
                    travelerColor:
                      updated?.assigneeId != null
                        ? travelers.find((t) => String(t.id) === String(updated.assigneeId))?.color ??
                          null
                        : null,
                  }
                : x,
            ),
          );
        } catch (e) {
          console.error('공동 준비물 체크 변경 실패:', e);
          Alert.alert('실패', '체크 상태 변경에 실패했습니다.');
        }
      })();
      return;
    }
    setter(list.map((it, i) => (i === index ? { ...it, checked: !it.checked } : it)));
  };

  const assignTraveler = (list, setter, index) => {
    const item = list[index];
    if (setter === setShared) {
      (async () => {
        try {
          const updated = item.travelerId ? await unassignSharedItem(tripId, item.id) : await assignSharedItem(tripId, item.id);
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id)
                ? {
                    ...x,
                    travelerId: updated?.assigneeId != null ? String(updated.assigneeId) : null,
                    travelerName: updated?.assigneeName ?? null,
                    travelerColor:
                      updated?.assigneeId != null
                        ? travelers.find((t) => String(t.id) === String(updated.assigneeId))?.color ??
                          null
                        : null,
                  }
                : x,
            ),
          );
        } catch (e) {
          console.error('공동 준비물 담당자 변경 실패:', e);
          Alert.alert('안내', '담당자 지정/해제는 본인만 할 수 있습니다.');
        }
      })();
      return;
    }
    // 진행 중 화면에서는 로컬 할일(필수)만 사용: 선택된 여행자 할당
    // 기존 PrepareScreen과 동일 로직을 유지하기 위해 여기서는 no-op 또는 추후 통합 가능
    Alert.alert('안내', '이 화면에서는 담당자 할당을 지원하지 않습니다.');
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
            endTrip(trip.id);
          } catch (e) {
            console.error(e);
          } finally {
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
              showDelete={false}
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
          toggleCheck,
          showAssignee: true,
          assignTraveler,
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
          toggleCheck,
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
          toggleCheck,
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
          toggleCheck,
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