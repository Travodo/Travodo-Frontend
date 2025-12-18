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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import ChecklistRow from '../../components/ChecklistRow';
import TravelerAvatar from '../../components/TravelerAvatar';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { colors } from '../../styles/colors';
import { upcomingTrips } from '../../data/TripList';

function PrepareScreen() {
  const trip = upcomingTrips[0];
  const navigation = useNavigation();

  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  const [isAddingTraveler, setIsAddingTraveler] = useState(false);
  const [travelerName, setTravelerName] = useState('');

  const colorPool = ['#6B8EFF', '#FFD66B', '#FF8A8A', '#9AD77D'];

  const [necessity, setNecessity] = useState([]);
  const [shared, setShared] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [activities, setActivities] = useState([]);
  const [memos, setMemos] = useState([]);

  const [adding, setAdding] = useState(null);
  const [text, setText] = useState('');

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
    if (!selectedTraveler) {
      alert('여행자를 먼저 선택해주세요!');
      return;
    }

    const traveler = travelers.find((t) => t.id === selectedTraveler);

    setter(
      list.map((item, i) =>
        i === index
          ? {
              ...item,
              travelerId: traveler.id,
              travelerName: traveler.name,
              travelerColor: traveler.color,
            }
          : item,
      ),
    );
  };

  const deleteItem = (list, setter, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  const editItem = (list, setter, index, newContent) => {
    setter(list.map((item, i) => (i === index ? { ...item, content: newContent } : item)));
  };

  const handleAddTraveler = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>여행 준비 리스트</Text>
      <Text style={styles.subTitle}>신나는 여행을 준비해 봐요!</Text>

      <View style={styles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>여행자</Text>

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
              <View style={styles.travelerList}>
                {travelers.map((t) => (
                  <TravelerAvatar
                    key={t.id}
                    name={t.name}
                    color={t.color}
                    selected={selectedTraveler === t.id}
                    onPress={() => setSelectedTraveler(t.id)}
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
                  <Plus width={20} height={20} />
                </Pressable>
              )}
            </>
          )}
        </View>

        <View style={styles.sectionDivider} />

        {renderSection(
          '필수 할 일',
          necessity,
          setNecessity,
          'necessity',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          assignTraveler,
          true,
        )}

        {renderSection(
          '공동 준비물',
          shared,
          setShared,
          'shared',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          assignTraveler,
          true,
        )}

        {renderSection(
          '개인 준비물',
          personal,
          setPersonal,
          'personal',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          false,
        )}

        {renderSection(
          '여행 활동',
          activities,
          setActivities,
          'activities',
          adding,
          setAdding,
          text,
          setText,
          addItem,
          deleteItem,
          editItem,
          false,
        )}

        <Text style={styles.sectionTitle}>메모장</Text>

        {memos.map((memo) => (
          <Pressable
            key={memo.id}
            style={styles.memoRow}
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
            <Text style={styles.memoText}>{memo.title}</Text>
          </Pressable>
        ))}

        <View style={styles.plusCenter}>
          <Pressable
            style={styles.plusButton}
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

        <View style={styles.sectionDivider} />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startText}>여행 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteText}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function renderSection(
  title,
  list,
  setter,
  key,
  adding,
  setAdding,
  text,
  setText,
  addItem,
  deleteItem,
  editItem,
  assignTraveler,
  showAssignee = false,
) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>

      {list.map((item, index) => (
        <ChecklistRow
          key={item.id}
          content={item.content}
          travelerName={item.travelerName}
          travelerColor={item.travelerColor}
          showAssignee={showAssignee}
          onAssign={() => assignTraveler(list, setter, index)}
          onDelete={() => deleteItem(list, setter, index)}
          onEdit={(value) => editItem(list, setter, index, value)}
        />
      ))}

      {adding === key && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
            placeholder="내용을 입력하세요"
            onSubmitEditing={() => addItem(setter, list)}
          />
          <Pressable onPress={() => setAdding(null)}>
            <MaterialIcons name="close" size={22} />
          </Pressable>
        </View>
      )}

      <View style={styles.plusCenter}>
        <Pressable style={styles.plusButton} onPress={() => setAdding(key)}>
          <Plus width={24} height={24} />
        </Pressable>
      </View>

      <View style={styles.sectionDivider} />
    </>
  );
}

function PlusCenter({ onPress }) {
  return (
    <View style={styles.plusCenter}>
      <Pressable style={styles.plusButton} onPress={onPress}>
        <Plus width={24} height={24} />
      </Pressable>
    </View>
  );
}

export default PrepareScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayscale[100] },

  pageTitle: {
    fontSize: 20,
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 6,
  },

  subTitle: {
    fontSize: 16,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Regular',
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  fixedCard: { paddingHorizontal: 20, paddingBottom: 8 },

  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.grayscale[1000],
  },

  TravelerplusButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { gap: 10 },

  memoList: { gap: 14 },

  memoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },

  memoText: { fontSize: 16, fontFamily: 'Pretendard-Regular', color: colors.grayscale[1000] },

  plusCenter: { alignItems: 'center', marginTop: 12 },

  plusButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  sectionDivider: {
    height: 1.2,
    backgroundColor: colors.grayscale[300],
    marginTop: 28,
    marginBottom: 16,
  },

  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 10 },

  startButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 23,
    marginHorizontal: 7,
  },

  startText: { color: colors.grayscale[100], fontFamily: 'Pretendard-SemiBold', fontSize: 16 },

  deleteButton: {
    backgroundColor: colors.grayscale[400],
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 23,
    marginHorizontal: 7,
  },

  deleteText: { color: colors.grayscale[100], fontFamily: 'Pretendard-SemiBold', fontSize: 16 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    paddingVertical: 6,
  },

  travelerRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* 여행자들 가로 리스트 */
  travelerList: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
    paddingRight: 8,
    flexWrap: 'wrap',
  },

  /* 처음(0명)일 때 가운데 + */
  centerPlusButton: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: -20,
  },

  /* 여행자 있을 때 오른쪽 + */
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
});
