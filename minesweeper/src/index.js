import './style.scss';

import {
  APP_TITLE,
  START_MESSAGE,
  EASY_LEVEL,
  MEDIUM_LEVEL,
  HARD_LEVEL,
} from './const';

import {
  getRandomInteger,
  formatInteger,
  formatDate,
  saveGame,
  loadGame,
  deleteSaveSlot,
  saveScore,
  loadScore,
  saveTheme,
  loadTheme,
  saveMuteSounds,
  loadMuteSounds,
  saveDifficultyLevel,
  loadDifficultyLevel,
} from './utils';

import {
  createRadioButton,
  createInputNumber,
  createWarning,
  closeAllWarnings,
} from './components';

let mainTheme = loadTheme() || 'light';
let mute = loadMuteSounds() || false;
let difficultyLevel = loadDifficultyLevel() || EASY_LEVEL;
let customMineCount = difficultyLevel.mineCount;

function handleThemeChange(event) {
  const body = document.querySelector('.body');
  if (event.target.value === 'Dark') {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    mainTheme = 'dark';
  } else {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    mainTheme = 'light';
  }
  saveTheme(mainTheme);
}

function generateThemeSelection() {
  const isDarkTheme = mainTheme === 'dark';

  const fragment = document.createDocumentFragment();

  const title = document.createElement('div');
  title.textContent = 'Theme:';

  const container = document.createElement('div');
  container.classList.add('settings__theme');
  container.appendChild(title);
  container.appendChild(createRadioButton('theme', 'Light', !isDarkTheme, handleThemeChange));
  container.appendChild(createRadioButton('theme', 'Dark', isDarkTheme, handleThemeChange));

  fragment.appendChild(container);

  return fragment;
}

function handleSoundsChange(event) {
  mute = event.target.value === 'Off';
  saveMuteSounds(mute);
}

function generateSoundSelection() {
  const fragment = document.createDocumentFragment();

  const title = document.createElement('div');
  title.textContent = 'Sounds:';

  const container = document.createElement('div');
  container.classList.add('settings__sounds');
  container.appendChild(title);
  container.appendChild(createRadioButton('sounds', 'On', !mute, handleSoundsChange));
  container.appendChild(createRadioButton('sounds', 'Off', mute, handleSoundsChange));

  fragment.appendChild(container);

  return fragment;
}

class Board {
  constructor() {
    this.sizeX = 0;
    this.sizeY = 0;
    this.mineCount = 0;
    this.minesRemaining = 0;
    this.timer = 0;
    this.timerId = 0;
    this.moveCount = 0;
    this.gameOn = false;
    this.win = false;
    this.lose = false;
    this.difficultyLevel = null;
    this.cells = [];
    this.mines = [];
    this.elements = {
      cells: null,
      mineCount: null,
      minesRemaining: null,
      timer: null,
      moveCount: null,
      message: null,
      settings: null,
      customMineCount: null,
      score: null,
    };
    this.audioClick = new Audio();
    this.audioClick.src = './assets/sounds/click.wav';
    this.audioClick.preload = 'auto';
    this.audioWin = new Audio();
    this.audioWin.src = './assets/sounds/win.wav';
    this.audioWin.preload = 'auto';
    this.audioLose = new Audio();
    this.audioLose.src = './assets/sounds/lose.wav';
    this.audioLose.preload = 'auto';
  }

  toJSON() {
    return {
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      mineCount: this.mineCount,
      minesRemaining: this.minesRemaining,
      timer: this.timer,
      moveCount: this.moveCount,
      cells: this.cells,
      mines: this.mines,
      difficultyLevel: this.difficultyLevel,
    };
  }

  init() {
    const saveData = loadGame();
    if (!saveData) {
      // New game
      this.sizeX = difficultyLevel.sizeX;
      this.sizeY = difficultyLevel.sizeY;
      this.mineCount = difficultyLevel.mineCount;
      this.minesRemaining = difficultyLevel.mineCount;
      this.difficultyLevel = difficultyLevel;
      this.generateEmptyMinefield();
      this.generateHtml();
    } else {
      // Continue saved game
      this.sizeX = saveData.sizeX;
      this.sizeY = saveData.sizeY;
      this.difficultyLevel = saveData.difficultyLevel;
      this.mineCount = saveData.mineCount;
      this.minesRemaining = saveData.minesRemaining;
      this.timer = saveData.timer;
      this.moveCount = saveData.moveCount;
      this.cells = saveData.cells;
      this.mines = saveData.mines;
      this.generateHtml();
      this.continueGame();
    }
  }

  generateEmptyMinefield() {
    this.cells = [];
    for (let i = 0; i < this.sizeX; i += 1) {
      this.cells[i] = [];
      for (let j = 0; j < this.sizeY; j += 1) {
        this.cells[i][j] = {
          i,
          j,
          opened: false,
          flagged: false,
          mined: false,
          neighborMineCount: 0,
        };
      }
    }
  }

  generateHtml() {
    // h1
    const title = document.createElement('h1');
    title.textContent = APP_TITLE;
    title.classList.add('title');

    // Messege
    this.elements.message = document.createElement('div');
    this.elements.message.textContent = START_MESSAGE;
    this.elements.message.classList.add('message');

    // Buttons
    const btnNewGame = document.createElement('button');
    btnNewGame.textContent = 'New game';
    btnNewGame.classList.add('button', 'menu__new-game');
    btnNewGame.addEventListener('click', () => {
      this.stopGame();
      this.createNewGame();
    });

    const btnSettings = document.createElement('button');
    btnSettings.textContent = 'Settings';
    btnSettings.classList.add('button', 'menu__settings');
    btnSettings.addEventListener('click', () => {
      if (this.elements.settings.classList.contains('hidden')) {
        this.showSettings();
      } else {
        this.hideSettings();
      }
    });

    const btnScore = document.createElement('button');
    btnScore.textContent = 'Score';
    btnScore.classList.add('button', 'menu__score');
    btnScore.addEventListener('click', () => {
      if (this.elements.score.classList.contains('hidden')) {
        this.showScore();
      } else {
        this.hideScore();
      }
    });

    // Menu => Mine count
    const textMines = document.createElement('div');
    textMines.classList.add('info__description');
    textMines.textContent = 'Mines';

    this.elements.mineCount = document.createElement('div');
    this.elements.mineCount.classList.add('info__value');
    this.elements.mineCount.textContent = formatInteger(this.mineCount);

    const minesInfoContainer = document.createElement('div');
    minesInfoContainer.classList.add('info__container');
    minesInfoContainer.appendChild(this.elements.mineCount);
    minesInfoContainer.appendChild(textMines);

    // Menu => Flags
    const textFlags = document.createElement('div');
    textFlags.classList.add('info__description');
    textFlags.textContent = 'Flags';

    this.elements.minesRemaining = document.createElement('div');
    this.elements.minesRemaining.classList.add('info__value');
    this.elements.minesRemaining.textContent = formatInteger(this.minesRemaining);

    const flagsInfoContainer = document.createElement('div');
    flagsInfoContainer.classList.add('info__container');
    flagsInfoContainer.appendChild(this.elements.minesRemaining);
    flagsInfoContainer.appendChild(textFlags);

    const minesInfo = document.createElement('div');
    minesInfo.classList.add('info');
    minesInfo.appendChild(minesInfoContainer);
    minesInfo.appendChild(flagsInfoContainer);

    // Menu => Timer
    const textTimer = document.createElement('div');
    textTimer.classList.add('info__description');
    textTimer.textContent = 'Time';

    this.elements.timer = document.createElement('div');
    this.elements.timer.classList.add('info__value');
    this.elements.timer.textContent = formatInteger(this.timer);

    const timerInfoContainer = document.createElement('div');
    timerInfoContainer.classList.add('info__container');
    timerInfoContainer.appendChild(textTimer);
    timerInfoContainer.appendChild(this.elements.timer);

    // Menu => Moves
    const textMoves = document.createElement('div');
    textMoves.classList.add('info__description');
    textMoves.textContent = 'Clicks';

    this.elements.moveCount = document.createElement('div');
    this.elements.moveCount.classList.add('info__value');
    this.elements.moveCount.textContent = formatInteger(this.moveCount);

    const movesInfoContainer = document.createElement('div');
    movesInfoContainer.classList.add('info__container');
    movesInfoContainer.appendChild(textMoves);
    movesInfoContainer.appendChild(this.elements.moveCount);

    const gameInfo = document.createElement('div');
    gameInfo.classList.add('info');
    gameInfo.appendChild(timerInfoContainer);
    gameInfo.appendChild(movesInfoContainer);

    // Main menu
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.appendChild(minesInfo);
    menu.appendChild(btnNewGame);
    menu.appendChild(gameInfo);

    // Secondary menu
    const secondaryMenu = document.createElement('div');
    secondaryMenu.classList.add('menu');
    secondaryMenu.appendChild(btnSettings);
    secondaryMenu.appendChild(btnScore);

    // Cells
    this.elements.cells = document.createElement('div');
    this.elements.cells.classList.add('cells');
    this.elements.cells.appendChild(this.generateHtmlCells());

    // Board
    const board = document.createElement('div');
    board.classList.add('board');
    board.classList.add(`board_${this.difficultyLevel.name.toLowerCase()}`);

    const boardInner = document.createElement('div');
    boardInner.classList.add('board__inner');
    boardInner.appendChild(menu);
    boardInner.appendChild(this.elements.cells);
    boardInner.appendChild(secondaryMenu);

    board.appendChild(boardInner);

    // Settings
    this.elements.settings = document.createElement('div');
    this.elements.settings.appendChild(generateThemeSelection());
    this.elements.settings.appendChild(generateSoundSelection());
    this.elements.settings.appendChild(this.generateLevelSelection());
    this.elements.settings.appendChild(this.generateMineCountSelection());
    this.elements.settings.classList.add('settings', 'hidden');

    this.elements.customMineCount = this.elements.settings.querySelector('input[name="mine-count"]');

    // Score
    this.elements.score = document.createElement('div');
    this.elements.score.classList.add('score', 'hidden');

    const main = document.createElement('div');
    main.classList.add('container');
    main.appendChild(title);
    main.appendChild(this.elements.message);
    main.appendChild(board);
    main.appendChild(this.elements.settings);
    main.appendChild(this.elements.score);

    // Body
    const body = document.querySelector('body');
    body.classList.add('body');
    if (mainTheme === 'dark') {
      body.classList.add('body', 'theme-dark');
    } else {
      body.classList.add('body', 'theme-light');
    }
    document.body.appendChild(main);
  }

  generateHtmlCells() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.sizeX; i += 1) {
      const line = document.createElement('div');
      line.classList.add('line');
      for (let j = 0; j < this.sizeY; j += 1) {
        const cell = document.createElement('div');
        cell.id = `cell-${i}-${j}`;
        cell.classList.add('cell');
        cell.classList.add(...this.getCellClasses(i, j));

        cell.setAttribute('i', i);
        cell.setAttribute('j', j);

        const cellValue = this.getCellValue(i, j);
        if (cellValue > 0) {
          cell.innerText = cellValue;
          cell.setAttribute('value', cellValue);
        }

        cell.addEventListener('click', (event) => {
          this.handleLeftClick(event);
        });
        cell.addEventListener('contextmenu', (event) => {
          this.handleRightClick(event);
        });
        line.appendChild(cell);
      }
      fragment.appendChild(line);
    }
    return fragment;
  }

  resetHtml() {
    while (this.elements.cells.firstChild) {
      this.elements.cells.removeChild(this.elements.cells.firstChild);
    }

    this.elements.cells.appendChild(this.generateHtmlCells());

    this.elements.message.classList.remove('message_win', 'message_lose');
    this.elements.message.textContent = START_MESSAGE;
    this.elements.mineCount.textContent = formatInteger(this.mineCount);
    this.elements.minesRemaining.textContent = formatInteger(this.minesRemaining);
    this.elements.timer.textContent = formatInteger(this.timer);
    this.elements.moveCount.textContent = formatInteger(this.moveCount);

    const board = document.querySelector('.board');
    board.classList.remove('board_easy', 'board_medium', 'board_hard');
    board.classList.add(`board_${difficultyLevel.name.toLowerCase()}`);
  }

  handleDifficultyLevelChange(event) {
    if (event.target.value === 'Hard') {
      difficultyLevel = HARD_LEVEL;
    } else if (event.target.value === 'Medium') {
      difficultyLevel = MEDIUM_LEVEL;
    } else {
      difficultyLevel = EASY_LEVEL;
    }
    saveDifficultyLevel(difficultyLevel);
    customMineCount = difficultyLevel.mineCount;
    this.elements.customMineCount.value = customMineCount;

    const warning = document.querySelector('.settings__difficulty .warning-restart');
    warning.classList.remove('hidden');
  }

  generateLevelSelection() {
    let isEasy;
    let isMedium;
    let isHard;

    if (difficultyLevel.name === 'Hard') {
      isHard = true;
    } else if (difficultyLevel.name === 'Medium') {
      isMedium = true;
    } else {
      isEasy = true;
    }

    const fragment = document.createDocumentFragment();

    const title = document.createElement('div');
    title.textContent = 'Difficulty:';

    const container = document.createElement('div');
    container.classList.add('settings__difficulty');
    container.appendChild(title);
    container.appendChild(createRadioButton('difficulty', 'Easy', isEasy, this.handleDifficultyLevelChange.bind(this)));
    container.appendChild(createRadioButton('difficulty', 'Medium', isMedium, this.handleDifficultyLevelChange.bind(this)));
    container.appendChild(createRadioButton('difficulty', 'Hard', isHard, this.handleDifficultyLevelChange.bind(this)));
    container.appendChild(createWarning());

    fragment.appendChild(container);

    return fragment;
  }

  handleMineCountChange(event) {
    customMineCount = event.target.value;

    if (customMineCount > difficultyLevel.maxMineCount) {
      customMineCount = difficultyLevel.maxMineCount;
      this.elements.customMineCount.value = customMineCount;
    } else if (customMineCount < 1) {
      customMineCount = 1;
      this.elements.customMineCount.value = customMineCount;
    }

    const warning = document.querySelector('.settings__mine-count .warning-restart');
    warning.classList.remove('hidden');
  }

  generateMineCountSelection() {
    const fragment = document.createDocumentFragment();

    const title = document.createElement('div');
    title.textContent = 'Mine count:';

    const container = document.createElement('div');
    container.classList.add('settings__mine-count');
    container.appendChild(title);
    container.appendChild(createInputNumber('mine-count', customMineCount, this.handleMineCountChange.bind(this)));
    container.appendChild(createWarning());

    fragment.appendChild(container);

    return fragment;
  }

  showSettings() {
    const { score, settings } = this.elements;
    score.classList.add('hidden');
    settings.classList.remove('hidden');
  }

  hideSettings() {
    const { settings } = this.elements;
    settings.classList.add('hidden');
  }

  showScore() {
    const { score } = this.elements;
    while (score.firstChild) {
      score.removeChild(score.firstChild);
    }

    const title = document.createElement('div');
    title.classList.add('score__title');
    title.textContent = 'Total score';

    const table = document.createElement('div');
    table.classList.add('score__table');

    const headerNum = document.createElement('div');
    headerNum.textContent = '№';
    table.appendChild(headerNum);

    const headerDate = document.createElement('div');
    headerDate.textContent = 'Date';
    table.appendChild(headerDate);

    const headerTime = document.createElement('div');
    headerTime.textContent = 'Time';
    table.appendChild(headerTime);

    const headerMoves = document.createElement('div');
    headerMoves.textContent = 'Clicks';
    table.appendChild(headerMoves);

    const scoreData = loadScore() || [];

    scoreData.forEach((data, index) => {
      const num = document.createElement('div');
      num.textContent = index + 1;
      table.appendChild(num);

      const date = document.createElement('div');
      date.textContent = formatDate(data.date);
      table.appendChild(date);

      const time = document.createElement('div');
      time.textContent = data.timer;
      table.appendChild(time);

      const moves = document.createElement('div');
      moves.textContent = data.moveCount;
      table.appendChild(moves);
    });

    score.appendChild(title);
    score.appendChild(table);

    this.elements.settings.classList.add('hidden');
    score.classList.remove('hidden');
  }

  hideScore() {
    const { score } = this.elements;
    score.classList.add('hidden');
  }

  getCellClasses(i, j) {
    const classes = [];
    const cell = this.cells[i][j];
    if (cell.opened) {
      classes.push('opened');
    } else if (cell.flagged) {
      classes.push('closed', 'flag');
    } else {
      classes.push('closed');
    }
    return classes;
  }

  getCellValue(i, j) {
    const cell = this.cells[i][j];
    if (cell.opened) {
      return cell.neighborMineCount;
    }
    return '';
  }

  getCurrentCell(element) {
    const i = Number(element.getAttribute('i'));
    const j = Number(element.getAttribute('j'));
    return this.cells[i][j];
  }

  getCurrentElement(cell) {
    return this.elements.cells.querySelector(`#cell-${cell.i}-${cell.j}`);
  }

  handleLeftClick(event) {
    if (this.win || this.lose) {
      return;
    }

    this.moveCount += 1;
    this.elements.moveCount.textContent = formatInteger(this.moveCount);

    const element = event.currentTarget;
    const cell = this.getCurrentCell(element);

    if (cell.opened) {
      return;
    }

    if (cell.flagged) {
      element.classList.remove('flag');
      cell.flagged = false;
      return;
    }

    if (!this.gameOn) {
      this.startNewGame(cell);
    }

    this.openCell(cell);

    if (this.isAllCellsOpened()) {
      this.victory();
    }

    if (!this.win && !this.lose && !mute) {
      this.audioClick.play();
    }

    if (this.gameOn) {
      saveGame(this);
    }
  }

  handleRightClick(event) {
    event.preventDefault();

    if (this.win || this.lose) {
      return;
    }

    const element = event.currentTarget;
    const cell = this.getCurrentCell(element);

    if (cell.opened) {
      return;
    }

    element.classList.toggle('flag');
    cell.flagged = !cell.flagged;

    if (cell.flagged) {
      this.minesRemaining -= 1;
      if (this.gameOn && this.minesRemaining === 0 && this.isMinesFlagged()) {
        this.victory();
      }
    } else {
      this.minesRemaining += 1;
    }
    this.elements.minesRemaining.textContent = formatInteger(this.minesRemaining);

    if (!this.win && !this.lose && !mute) {
      this.audioClick.play();
    }

    if (this.gameOn) {
      saveGame(this);
    }
  }

  isMinesFlagged() {
    return this.mines.every((cell) => cell.flagged);
  }

  isAllCellsOpened() {
    for (let i = 0; i < this.sizeX; i += 1) {
      for (let j = 0; j < this.sizeY; j += 1) {
        if (!this.cells[i][j].mined && !this.cells[i][j].opened) {
          return false;
        }
      }
    }
    return true;
  }

  victory() {
    this.gameOn = false;
    this.win = true;
    this.stopTimer();
    saveScore(this.timer, this.moveCount);
    deleteSaveSlot();

    if (!mute) {
      this.audioWin.play();
    }

    this.elements.message.classList.add('message_win');
    this.elements.message.textContent = `Hooray! You found all mines in ${this.timer}
      seconds and ${this.moveCount} moves!`;

    if (!this.elements.score.classList.contains('hidden')) {
      this.showScore();
    }
  }

  gameOver() {
    this.gameOn = false;
    this.lose = true;
    this.stopTimer();
    this.openMines();
    this.checkMistakes();
    deleteSaveSlot();

    if (!mute) {
      this.audioLose.play();
    }

    this.elements.message.classList.add('message_lose');
    this.elements.message.textContent = 'Game over! Try again';
  }

  openMines() {
    this.mines.filter((cell) => !cell.flagged && !cell.opened).forEach((cell) => {
      const element = this.getCurrentElement(cell);
      element.classList.remove('closed');
      element.classList.add('opened', 'mine');
    });
  }

  checkMistakes() {
    for (let i = 0; i < this.sizeX; i += 1) {
      for (let j = 0; j < this.sizeY; j += 1) {
        const cell = this.cells[i][j];
        if (cell.flagged && !cell.mined) {
          const element = this.elements.cells.querySelector(`#cell-${i}-${j}`);
          element.classList.remove('closed', 'flag');
          element.classList.add('opened', 'mistake');
        }
      }
    }
  }

  openCell(cell) {
    if (cell.opened || cell.flagged) {
      return;
    }

    const element = this.getCurrentElement(cell);
    element.classList.remove('closed');
    element.classList.add('opened');
    this.cells[cell.i][cell.j].opened = true;

    if (cell.mined) {
      element.classList.add('mine', 'bang');
      this.gameOver();
    } else if (cell.neighborMineCount > 0) {
      element.innerText = cell.neighborMineCount;
      element.setAttribute('value', cell.neighborMineCount);
    } else if (cell.neighborMineCount === 0) {
      this.openAllNeighbors(cell);
    }
  }

  openAllNeighbors(currentCell) {
    for (let i = currentCell.i - 1; i <= currentCell.i + 1; i += 1) {
      for (let j = currentCell.j - 1; j <= currentCell.j + 1; j += 1) {
        if (i >= 0 && j >= 0 && this.cells[i] && this.cells[i][j]) {
          this.openCell(this.cells[i][j]);
        }
      }
    }
  }

  assignMines(startingCell) {
    this.mines = [];
    let count = 0;
    while (count < this.mineCount) {
      const i = getRandomInteger(0, this.sizeX - 1);
      const j = getRandomInteger(0, this.sizeY - 1);
      if (!this.cells[i][j].mined
        && (startingCell.i !== i
        || startingCell.j !== j)
      ) {
        this.cells[i][j].mined = true;
        this.mines.push(this.cells[i][j]);
        count += 1;
      }
    }
  }

  calculateNeighborMineCounts() {
    function getMineCount(currentCell, cells) {
      let count = 0;
      for (let i = currentCell.i - 1; i <= currentCell.i + 1; i += 1) {
        for (let j = currentCell.j - 1; j <= currentCell.j + 1; j += 1) {
          if (i >= 0 && j >= 0 && cells[i] && cells[i][j]) {
            count = cells[i][j].mined ? (count += 1) : count;
          }
        }
      }
      return count;
    }

    for (let i = 0; i < this.sizeX; i += 1) {
      for (let j = 0; j < this.sizeY; j += 1) {
        if (!this.cells[i][j].mined) {
          this.cells[i][j].neighborMineCount = getMineCount({ i, j }, this.cells);
        }
      }
    }
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.timer += 1;
      this.elements.timer.textContent = formatInteger(this.timer);
      if (this.gameOn) {
        saveGame(this);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  createNewGame() {
    this.win = false;
    this.lose = false;
    this.timer = 0;
    this.moveCount = 0;

    this.sizeX = difficultyLevel.sizeX;
    this.sizeY = difficultyLevel.sizeY;
    this.difficultyLevel = difficultyLevel;
    this.mineCount = customMineCount;
    this.minesRemaining = customMineCount;

    this.generateEmptyMinefield();
    this.resetHtml();
    closeAllWarnings();
  }

  stopGame() {
    this.gameOn = false;
    this.stopTimer();
    deleteSaveSlot();
  }

  continueGame() {
    this.startTimer();
    this.gameOn = true;
  }

  startNewGame(startingCell) {
    this.assignMines(startingCell);
    this.calculateNeighborMineCounts();
    this.startTimer();
    this.difficultyLevel = difficultyLevel;
    this.gameOn = true;
  }
}

const board = new Board();

window.addEventListener('DOMContentLoaded', () => {
  board.init(EASY_LEVEL);
});
