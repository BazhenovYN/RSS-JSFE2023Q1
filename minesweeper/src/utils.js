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
