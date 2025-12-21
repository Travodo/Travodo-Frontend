export const colorPalette = [
  '#EE8787',
  '#FFD2C2',
  '#EAAF4F',
  '#FFE386',
  '#A4C664',
  '#B8CDFF',
  '#769FFF',
  '#506CAD',
];

let usedColors = [];

export function getRandomColor() {
  if (usedColors.length === colorPalette.length) usedColors = [];

  const availableColors = colorPalette.filter((c) => !usedColors.includes(c));
  const random = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(random);
  return random;
}
