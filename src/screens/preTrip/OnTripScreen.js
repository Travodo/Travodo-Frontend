import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import TravelerAvatar from '../../components/TravelerAvatar';
import { renderSection } from '../../utils/renderSection';
import { colors } from '../../styles/colors';
import styles from './prepareStyles';
import Plus from '../../../assets/ProfileImg/Plus.svg';

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

  const [travelers] = useState(initTravelers);
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
        onPress: () => {
          navigation.popToTop();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>여행 TODO 시작</Text>
      <Text style={styles.subTitle}>Travodo와 여행을 시작했어요!</Text>

      <View style={styles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>여행자</Text>
        <View style={styles.travelerList}>
          {travelers.map((t) => (
            <TravelerAvatar key={t.id} name={t.name} color={t.color} />
          ))}
        </View>

        <View style={styles.sectionDivider} />

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
          styles,
        })}
        <View style={styles.sectionDivider} />

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
          styles,
        })}
        <View style={styles.sectionDivider} />

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
          styles,
        })}
        <View style={styles.sectionDivider} />

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
          styles,
        })}
        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>메모장</Text>

        {memos.map((memo) => (
          <View key={memo.id} style={styles.memoRow}>
            <Pressable
              style={styles.memoLeft}
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

            <Pressable onPress={() => setMemos((prev) => prev.filter((m) => m.id !== memo.id))} hitSlop={8}>
              <MaterialIcons name="delete-outline" size={20} color={colors.grayscale[600]} />
            </Pressable>
          </View>
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

        <View style={styles.endButtonWrapper}>
          <Pressable style={styles.endButton} onPress={handleEndTrip}>
            <Text style={styles.endButtonText}>여행 종료</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OnTripScreen;