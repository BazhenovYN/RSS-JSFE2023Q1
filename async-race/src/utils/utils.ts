import { emptyString } from 'app/consts';
import type { Color } from 'types';

const COLOR_LENGTH = 6; // #ffffff

const brend = [
  'Ford',
  'Audi',
  'BMW',
  'Toyota',
  'Volkswagen',
  'Mersedes',
  'Honda',
  'Nissan',
  'Chevrolet',
  'Subaru',
  'UAZ',
  'ZAZ',
  'Lada',
  'Tesla',
];
const model = [
  'Mustang',
  'A4',
  'A5',
  'X3',
  'X5',
  'Camry',
  'Golf',
  'Polo',
  'CLC',
  'Civic',
  'Rogue',
  'Silverado',
  'Outback',
  'Patriot',
  'Vesta',
  'Priora',
  'Granta',
  'Model Y',
  'Model X',
  'Model S',
];

export function getRandomCarName(): string {
  const randomBrend = brend[Math.floor(Math.random() * brend.length)];
  const randomModel = model[Math.floor(Math.random() * model.length)];
  return `${randomBrend} ${randomModel}`;
}

export function getRandomColor(): Color {
  const letters = '23456789abcdef'; // hexadecimal numbers for limiting the spectrum to light colors
  const {length} = letters;
  const color = [];
  for (let i = 0; i < COLOR_LENGTH; i += 1) {
    color.push(letters[Math.floor(Math.random() * length)]);
  }
  return `#${color.join(emptyString)}`;
}
