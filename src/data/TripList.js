// data/TripList.js

// 1. 다가오는 여행
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

// 2. 여행 데이터 (기존 data)
export const data = [
  {
    id: 1,
    tripTitle: '부산 정복기 🌊',
    startDate: '2025.05.01',
    endDate: '2025.05.03',
    circleColor: '#FF6B6B',
    location: '부산광역시 해운대구',
    people: 4,
    companions: ['김철수', '이영희', '박민수'],
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
];

// 3. 카테고리 탭
export const CATEGORY_TABS = [
  { id: 'c0', label: '전체' },
  { id: 'c1', label: '커플 / 연인' },
  { id: 'c2', label: '가족 / 친지' },
  { id: 'c3', label: '직장 / 동료' },
  { id: 'c4', label: '친구 / 지인' },
  { id: 'c5', label: '여행 / 취미' },
  { id: 'c6', label: '스터디 / 모임' },
];

// ★ [추가 1] 지난 여행 데이터 (LasttripScreen 오류 해결용)
export const pastTrips = [
  {
    id: 101,
    title: '2024 겨울 강원도',
    startDate: '2024.12.20',
    endDate: '2024.12.22',
    location: '강원도',
    color: '#FF5733',
  },
  {
    id: 102,
    title: '작년 여름 가평',
    startDate: '2024.08.10',
    endDate: '2024.08.11',
    location: '경기도 가평',
    color: '#33FF57',
  },
];

// ★ [추가 2] 커뮤니티 데이터 (CommunityContent 오류 해결용)
export const CommunityData = [
  {
    id: 1,
    nickname: '히재',
    title: '부산 여행 너무 좋았어요',
    content: '광안리 야경이 정말 예쁘더라고요. 추천합니다!',
    hCount: 15, // 좋아요 수
    cCount: 3, // 댓글 수
    isScrap: true, // 스크랩 여부 (테스트용)
    agoDate: '2시간 전',
    images: ['https://via.placeholder.com/300'], // 임시 이미지
    // 여행 계획 정보 (CommunityTripPlan용)
    tripTitle: '부산 정복기 🌊',
    startDate: '2025.05.01',
    endDate: '2025.05.03',
    location: '부산광역시',
    people: 4,
    todo: '해운대, 광안리, 돼지국밥',
    circleColor: '#FF6B6B',
  },
  {
    id: 2,
    nickname: '여행러',
    title: '제주도 혼자 여행',
    content: '혼자 가도 좋은 제주도 여행 코스 공유합니다.',
    hCount: 42,
    cCount: 10,
    isScrap: false,
    agoDate: '1일 전',
    tripTitle: '제주 힐링',
    startDate: '2025.06.10',
    endDate: '2025.06.15',
    location: '제주도',
    people: 1,
    todo: '올레길 걷기',
    circleColor: '#4ECDC4',
  },
];
