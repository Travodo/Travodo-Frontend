export const colorPalette = [
  '#FF6B6B', // 코랄핑크
  '#FFD93D', // 옐로우
  '#6BCB77', // 민트그린
  '#4D96FF', // 하늘블루
  '#845EC2', // 보라
  '#FF9671', // 피치
  '#2C73D2', // 블루
  '#0081CF', // 진한 파랑
  '#00C9A7', // 아쿠아
  '#FF5E78', // 로즈핑크
];

let usedColors = [];

export function getRandomColor() {
  if (usedColors.length === colorPalette.length) usedColors = [];

  const availableColors = colorPalette.filter((c) => !usedColors.includes(c));
  const random = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(random);
  return random;
}
