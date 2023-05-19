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
  saveGame,
  loadGame,
  deleteSaveSlot,
  saveScore,
  loadScore,
} from './utils';

class Board {
  constructor() {
    this.difficultyLevel = null;
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
    this.cells = [];
    this.mines = [];
    this.elements = {
      main: null,
      cells: null,
      minesRemaining: null,
      timer: null,
      message: null,
    };
    this.mute = false;
    this.audioWin = new Audio();
    this.audioWin.src = './assets/sounds/win.wav';
    this.audioWin.preload = 'auto';
    this.audioLose = new Audio();
    this.audioLose.src = './assets/sounds/lose.wav';
    this.audioLose.preload = 'auto';
  }

  toJSON() {
    return {
      difficultyLevel: this.difficultyLevel,
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      mineCount: this.mineCount,
      minesRemaining: this.minesRemaining,
      timer: this.timer,
      moveCount: this.moveCount,
      cells: this.cells,
      mines: this.mines,
      mute: this.mute,
    };
  }

  init(difficultyLevel) {
    const saveData = loadGame();
    if (!saveData) {
      // New game
      this.difficultyLevel = difficultyLevel;
      this.sizeX = difficultyLevel.sizeX;
      this.sizeY = difficultyLevel.sizeY;
      this.mineCount = difficultyLevel.mineCount;
      this.generateEmptyMinefield();
      this.generateHtml();
    } else {
      // Continue saved game
      this.difficultyLevel = saveData.difficultyLevel;
      this.sizeX = saveData.sizeX;
      this.sizeY = saveData.sizeY;
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
    const title = document.createElement('h1');
    title.textContent = APP_TITLE;
    title.classList.add('title');

    this.elements.message = document.createElement('div');
    this.elements.message.textContent = START_MESSAGE;
    this.elements.message.classList.add('message');

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
      
    });

    const btnScore = document.createElement('button');
    btnScore.textContent = 'Score';
    btnScore.classList.add('button', 'menu__score');
    btnScore.addEventListener('click', () => {
      
    });

    this.elements.minesRemaining = document.createElement('div');
    this.elements.minesRemaining.classList.add('menu__info');
    this.elements.minesRemaining.title = 'Mines remaining';
    this.elements.minesRemaining.textContent = '000';

    this.elements.timer = document.createElement('div');
    this.elements.timer.classList.add('menu__info');
    this.elements.timer.title = 'Timer';
    this.elements.timer.textContent = '000';

    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.appendChild(this.elements.minesRemaining);
    menu.appendChild(btnNewGame);
    menu.appendChild(this.elements.timer);

    const secondaryMenu = document.createElement('div');
    secondaryMenu.classList.add('menu');
    secondaryMenu.appendChild(btnSettings);
    secondaryMenu.appendChild(btnScore);

    this.elements.cells = document.createElement('div');
    this.elements.cells.classList.add('cells');
    this.elements.cells.appendChild(this.generateHtmlCells());

    const board = document.createElement('div');
    board.classList.add('board');

    const boardInner = document.createElement('div');
    boardInner.classList.add('board__inner');
    boardInner.appendChild(menu);
    boardInner.appendChild(this.elements.cells);
    boardInner.appendChild(secondaryMenu);

    board.appendChild(boardInner);

    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('container');
    this.elements.main.appendChild(title);
    this.elements.main.appendChild(this.elements.message);
    this.elements.main.appendChild(board);

    const body = document.querySelector('body');
    body.classList.add('body', 'theme-light');
    document.body.appendChild(this.elements.main);
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
    const cells = this.elements.cells.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i += 1) {
      const element = cells[i];
      element.classList.remove('mine', 'bang', 'opened', 'flag', 'mistake');
      element.removeAttribute('value');
      element.classList.add('closed');
      element.innerText = '';
    }
    this.elements.message.textContent = START_MESSAGE;
    this.elements.timer.textContent = '000';
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
      if (this.minesRemaining === 0 && this.isMinesFlagged()) {
        this.victory();
      }
    } else {
      this.minesRemaining += 1;
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

    if (!this.mute) {
      this.audioWin.play();
    }
    this.elements.message.textContent = `Hooray! You found all mines in ${this.timer}
      seconds and ${this.moveCount} moves!`;
  }

  gameOver() {
    this.gameOn = false;
    this.lose = true;
    this.stopTimer();
    this.openMines();
    this.checkMistakes();
    deleteSaveSlot();

    if (!this.mute) {
      this.audioLose.play();
    }
    this.elements.message.textContent = 'Game over! Try again';
  }

  openMines() {
    this.mines.filter((cell) => !cell.flagged && !cell.opened).forEach((cell) => {
      const element = this.getCurrentElement(cell);
      element.classList.remove('closed');
      element.classList.add('mine');
    });
  }

  checkMistakes() {
    for (let i = 0; i < this.sizeX; i += 1) {
      for (let j = 0; j < this.sizeY; j += 1) {
        const cell = this.cells[i][j];
        if (cell.flagged && !cell.mined) {
          const element = this.elements.cells.querySelector(`#cell-${i}-${j}`);
          element.classList.remove('closed', 'flag');
          element.classList.add('mistake');
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
    this.minesRemaining = 0;
    while (this.minesRemaining < this.mineCount) {
      const i = getRandomInteger(0, this.sizeX - 1);
      const j = getRandomInteger(0, this.sizeY - 1);
      if (!this.cells[i][j].mined
        && startingCell.i !== i
        && startingCell.j !== j
      ) {
        this.cells[i][j].mined = true;
        this.mines.push(this.cells[i][j]);
        this.minesRemaining += 1;
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
      this.elements.timer.textContent = this.timer;
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
    this.generateEmptyMinefield();
    this.resetHtml();
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
    this.gameOn = true;
  }
}

const board = new Board();

window.addEventListener('DOMContentLoaded', () => {
  board.init(EASY_LEVEL);
});
