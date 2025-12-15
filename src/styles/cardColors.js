export const colorPalette = [
  '#F9EEB6',
  '#EFB18B',
  '#CFDC83',
  '#AAD4E0',
  '#DAB4D8',
  '#90D48D',
  '#9EA0B2',
];

let usedColors = [];

export function getRandomColor() {
  if (usedColors.length === colorPalette.length) usedColors = [];

  const availableColors = colorPalette.filter((c) => !usedColors.includes(c));
  const random = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(random);
  return random;
}
