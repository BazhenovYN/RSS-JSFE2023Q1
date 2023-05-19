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
