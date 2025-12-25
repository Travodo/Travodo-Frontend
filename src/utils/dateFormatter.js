import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export const formatAgo = (dateString) => {
  if (!dateString) return '';

  const now = dayjs();
  const target = dayjs(dateString);
  const diffDays = now.diff(target, 'day');

  // 7일 이내면 "방금 전", "3시간 전" 등으로 표시
  if (diffDays < 7) {
    return target.fromNow();
  }
  // 7일이 지났으면 날짜 형식으로 표시
  return target.format('YYYY.MM.DD');
};
