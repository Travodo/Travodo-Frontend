export const upcomingTrips = [
  {
    id: 1,
    title: '일본 오사카',
    dDay: 3,
    startDate: '2026.09.03',
    endDate: '2026.09.05',
    location: 'A',
    companions: ['1', '2'],
  },

  {
    id: 2,
    title: '강릉',
    dDay: 26,
    startDate: '2026.09.26',
    endDate: '2026.09.27',
    location: 'B',
    companions: ['3', '4'],
  },
];

export const data = [
  {
    id: 1,
    tripTitle: '부산 정복기 🌊',
    startDate: '2025.05.01',
    endDate: '2025.05.03',
    circleColor: '#FF6B6B',
    location: '부산광역시 해운대구',
    people: 4,
    companions: ['김철수', '이영희', '박민수'], // 동행인 배열 (없으면 people 숫자만 써도 됨)
    todo: '해운대 요트 투어, 돼지국밥 맛집, 광안리 야경',
  },
  {
    id: 2,
    tripTitle: '제주도 힐링 여행 🌴',
    startDate: '2025.06.10',
    endDate: '2025.06.15',
    circleColor: '#4ECDC4',
    location: '제주특별자치도 애월읍',
    people: 2,
    todo: '랜디스 도넛, 곽지해수욕장 산책, 흑돼지 구이',
  },
  {
    id: 3,
    tripTitle: '서울 야경 투어 ✨',
    startDate: '2025.07.20',
    endDate: '2025.07.22',
    circleColor: '#FFE66D',
    location: '서울 용산구',
    people: 1,
    todo: '국립중앙박물관, 남산타워 케이블카, 이태원 맛집',
  },
  {
    id: 4,
    tripTitle: '강릉 안목해변 커피 투어 ☕',
    startDate: '2025.08.05',
    endDate: '2025.08.07',
    circleColor: '#4A90E2',
    location: '강원도 강릉시',
    people: 3,
    todo: '순두부 젤라또, 안목해변 카페거리, 중앙시장 닭강정',
  },
  {
    id: 5,
    tripTitle: '경주 역사 탐방 🏯',
    startDate: '2025.09.15',
    endDate: '2025.09.18',
    circleColor: '#A569BD',
    location: '경상북도 경주',
    people: 4,
    todo: '불국사 아침 산책, 첨성대 야경, 황리단길 카페',
  },
];

export const CATEGORY_TABS = [
  { id: 'c0', label: '전체' },
  { id: 'c1', label: '커플 / 연인' },
  { id: 'c2', label: '가족 / 친지' },
  { id: 'c3', label: '직장 / 동료' },
  { id: 'c4', label: '친구 / 지인' },
  { id: 'c5', label: '여행 / 취미' },
  { id: 'c6', label: '스터디 / 모임' },
];
