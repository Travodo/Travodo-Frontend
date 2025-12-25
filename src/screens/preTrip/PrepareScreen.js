import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import TripCard from '../../components/TripCard';
import ChecklistRow from '../../components/ChecklistRow';
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
} from '../../services/api';

function PrepareScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const trip = route?.params?.tripData;
  const tripId = trip?.id;

  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  // 선택 직후 바로 '담당자 지정'을 눌렀을 때도 최신 선택값을 쓰기 위해 ref로도 보관
  const selectedTravelerRef = useRef(null);

  const colorPool = ['#769FFF', '#FFE386', '#EE8787', '#A4C664'];

  const [necessity, setNecessity] = useState([]);
  const [shared, setShared] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [activities, setActivities] = useState([]);
  const [memos, setMemos] = useState([]);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');
  const [inviting, setInviting] = useState(false);

  const loadMembersAndShared = useCallback(async () => {
    if (!tripId) return;
    try {
      const members = await getTripMembers(tripId); // TripMemberResponse[]
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
      // 멤버 기반 색상맵은 "이번 로드 결과"로 계산해서 shared-items 매핑에 사용 (state 의존으로 루프 방지)
      const nextColorMap = {};
      mappedMembers.forEach((t) => {
        nextColorMap[String(t.id)] = t.color;
      });

      const items = await getSharedItems(tripId); // SharedItemResponse[]
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

  // 화면 재진입 시에도 동기화 (초대코드로 들어온 사용자도 최신 데이터 보장)
  useFocusEffect(
    useCallback(() => {
      loadMembersAndShared();
    }, [loadMembersAndShared]),
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
      const res = await getTripInviteCode(tripId); // { inviteCode, expiresAt, expired, canRegenerate }
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
          ],
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
      const res = await regenerateInviteCode(tripId); // { inviteCode }
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
      { text: '재발급 후 복사', onPress: regenerateAndCopyInviteCode, style: 'destructive' },
      { text: '취소', style: 'cancel' },
    ]);
  }, [fetchAndCopyInviteCode, regenerateAndCopyInviteCode]);

  const deleteItem = (list, setter, index) => {
    const item = list[index];
    if (setter === setShared) {
      // 서버 연동: 공동 준비물 삭제
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

  const editItem = (list, setter, index, newContent) => {
    const item = list[index];
    if (setter === setShared) {
      (async () => {
        try {
          const updated = await updateSharedItem(tripId, item.id, { name: newContent });
          setShared((prev) =>
            prev.map((x) =>
              String(x.id) === String(item.id)
                ? {
                    ...x,
                    content: updated?.name ?? newContent,
                    checked: !!updated?.checked,
                    travelerId: updated?.assigneeId != null ? String(updated.assigneeId) : null,
                    travelerName: updated?.assigneeName ?? null,
                    // travelerColor는 travelers state 기반으로 계산(없으면 그대로 유지)
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
    setter(list.map((it, i) => (i === index ? { ...it, content: newContent } : it)));
  };

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
    setter([
      ...list,
      {
        id: Date.now().toString(),
        content: text,
        checked: false,
        travelerId: null,
        travelerName: null,
        travelerColor: null,
      },
    ]);

    setText('');
    setAdding(null);
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
      // 백엔드 정책: 담당자는 "본인"만 지정/해제 가능
      (async () => {
        try {
          const updated = item.travelerId
            ? await unassignSharedItem(tripId, item.id)
            : await assignSharedItem(tripId, item.id);
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
    setter(
      list.map((item, i) => {
        if (i !== index) return item;

        const currentSelectedTraveler = selectedTravelerRef.current ?? selectedTraveler;
        if (!currentSelectedTraveler) {
          Alert.alert('알림', '여행자를 먼저 선택해주세요!');
          return item;
        }

        const traveler = travelers.find((t) => t.id === currentSelectedTraveler);

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
            <Text style={{ color: colors.grayscale[600], fontFamily: 'Pretendard-Regular' }}>
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
          toggleCheck,
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
              onPress={() => setMemos((prev) => prev.filter((m) => m.id !== memo.id))}
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
              navigation.navigate('StartTripScreen', {
                trip,
                travelers,
                necessity,
                shared,
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  travelerRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  invitePlusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayscale[100],
  },
  invitePlusButtonPressed: {
    opacity: 0.7,
  },
  invitePlusButtonDisabled: {
    opacity: 0.35,
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
    marginTop: 10,
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
    fontSize: 16,
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
    fontSize: 16,
  },
});
