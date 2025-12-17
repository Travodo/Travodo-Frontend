import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TripCard from '../../components/TripCard';
import ChecklistItem from '../../components/Checklist';
import TravelerAvatar from '../../components/TravelerAvatar';
import Plus from '../../../assets/ProfileImg/Plus.svg';
import { colors } from '../../styles/colors';
import { upcomingTrips } from '../../data/TripList';

function PrepareScreen() {
  const trip = upcomingTrips[0];
  const navigation = useNavigation();

  const travelers = [
    { id: 1, name: '홍길동', color: '#6B8EFF' },
    { id: 2, name: '유병재', color: '#FFD66B' },
    { id: 3, name: '차은우', color: '#FF8A8A' },
    { id: 4, name: '이수근', color: '#9AD77D' },
  ];

  const memos = ['100억 부자 유병재 vs 무일푼 차은우', '차은우'];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>여행 준비 리스트</Text>
      <Text style={styles.subTitle}>신나는 여행을 준비해 봐요!</Text>

      <View style={styles.fixedCard}>
        <TripCard trip={trip} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>여행자</Text>

        <View style={styles.travelerRow}>
          {travelers.map((traveler) => (
            <TravelerAvatar key={traveler.id} name={traveler.name} color={traveler.color} />
          ))}

          <Pressable style={styles.TravelerplusButton}>
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>공동 준비물</Text>

        <View style={styles.list}>
          <ChecklistItem content="여권" name="공동" />
          <ChecklistItem content="항공권" name="공동" />
        </View>

        <View style={styles.plusCenter}>
          <Pressable style={styles.plusButton}>
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>개인 준비물</Text>

        <View style={styles.list}>
          <ChecklistItem content="여권" name="차은우" />
          <ChecklistItem content="항공권" name="이수근" />
        </View>

        <View style={styles.plusCenter}>
          <Pressable style={styles.plusButton}>
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>여행 활동</Text>

        <View style={styles.list}>
          <ChecklistItem content="부산대 근처 모모스 커피 본점" />
          <ChecklistItem content="광안리 요트 투어" />
        </View>

        <View style={styles.plusCenter}>
          <Pressable style={styles.plusButton}>
            <Plus width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>메모장</Text>

        <View style={styles.memoList}>
          {memos.map((memo, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate('MemoDetail', { title: memo })}
              style={({ pressed }) => [styles.memoRow, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons name="description" size={22} color={colors.grayscale[500]} />
              <Text style={styles.memoText}>{memo}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.plusCenter}>
          <Pressable style={styles.plusButton}>
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

export default PrepareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

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

  fixedCard: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.grayscale[1000],
  },

  travelerRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },

  TravelerplusButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    gap: 10,
  },

  memoList: {
    gap: 14,
  },

  memoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  memoText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: colors.grayscale[1000],
  },

  plusCenter: {
    alignItems: 'center',
    marginTop: 12,
  },

  plusButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionDivider: {
    height: 1.2,
    backgroundColor: colors.grayscale[300],
    marginTop: 28,
    marginBottom: 16,
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
