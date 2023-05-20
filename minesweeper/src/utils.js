export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function saveGame(board) {
  localStorage.setItem('saveSlot', JSON.stringify(board));
}

export function loadGame() {
  return JSON.parse(localStorage.getItem('saveSlot'));
}

export function deleteSaveSlot() {
  localStorage.removeItem('saveSlot');
}

export function loadScore() {
  return JSON.parse(localStorage.getItem('totalScore'));
}

export function saveScore(timer, moveCount) {
  const score = loadScore() || [];
  const length = score.unshift({
    date: Date.now(),
    timer,
    moveCount,
  });
  if (length > 10) {
    score.pop();
  }
  localStorage.setItem('totalScore', JSON.stringify(score));
}

export function formatInteger(int) {
  if (int > 999) {
    return '999';
  }
  if (int < -99) {
    return '-99';
  }
  if (int < 0) {
    const str = `000${Math.abs(int)}`.slice(-2);
    return `-${str}`;
  }
  return `000${int}`.slice(-3);
}

export function formatDate(int) {
  const date = new Date(int);
  return date.toLocaleString();
}

export function saveTheme(theme) {
  return localStorage.setItem('mainTheme', theme);
}

export function loadTheme() {
  return localStorage.getItem('mainTheme');
}
