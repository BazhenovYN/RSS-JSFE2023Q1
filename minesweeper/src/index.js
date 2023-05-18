import './normalize.css';
import './style.scss';

import {
  APP_TITLE,
  EASY_LEVEL,
  MEDIUM_LEVEL,
  HARD_LEVEL 
} from './const';
import { getRandomInteger } from './utils';

class Board {
  constructor() {
    this.sizeX = 0;
    this.sizeY = 0;
    this.mineCount = 0;
    this.minesRemaining = 0;
    this.startTime = 0;
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
    };
  }

  init(difficultyLevel) {
    this.sizeX = difficultyLevel.sizeX;
    this.sizeY = difficultyLevel.sizeY;
    this.mineCount = difficultyLevel.mineCount;
    this.generateEmptyMinefield();
    this.generateHtml();
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
    title.innerText = APP_TITLE;
    title.classList.add('title');

    const btnNewGame = document.createElement('button');
    btnNewGame.textContent = 'New game';
    btnNewGame.classList.add('menu__new-game');
    btnNewGame.addEventListener('click', () => {
      this.stopGame();
      this.createNewGame();
    });

    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.appendChild(btnNewGame);

    this.elements.cells = document.createElement('div');
    this.elements.cells.classList.add('cells');
    this.elements.cells.appendChild(this.createMinefield());

    const board = document.createElement('div');
    board.classList.add('board');
    board.appendChild(menu);
    board.appendChild(this.elements.cells);

    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('container');
    this.elements.main.appendChild(title);
    this.elements.main.appendChild(board);

    document.body.appendChild(this.elements.main);
  }

  resetHtml() {
    const cells = this.elements.cells.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i += 1) {
      const element = cells[i];
      element.classList.remove('mine', 'bang', 'empty', 'flag', 'mistake');
      element.removeAttribute('value');
      element.classList.add('closed');
      element.innerText = '';
    }
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
  }

  handleRightClick(event) {
    event.preventDefault();

    if (this.win || this.lose) {
      return;
    }

    this.moveCount += 1;

    const element = event.currentTarget;
    const cell = this.getCurrentCell(element);

    if (cell.opened) {
      return;
    }

    element.classList.toggle('flag');
    cell.flagged = !cell.flagged;

    if (cell.flagged) {
      this.minesRemaining -= 1;
      if (this.minesRemaining === 0 && this.isWin()) {
        this.victory();
      }
    } else {
      this.minesRemaining += 1;
    }
  }

  isWin() {
    return this.mines.every((cell) => cell.flagged);
  }

  victory() {
    this.gameOn = false;
    this.win = true;
    this.stopTimer();
  }

  gameOver() {
    this.gameOn = false;
    this.lose = true;
    this.stopTimer();
    this.openMines();
    this.checkMistakes();
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
    if (cell.opened) {
      return;
    }

    const element = this.getCurrentElement(cell);
    element.classList.remove('closed');
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

  createMinefield() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.sizeX; i += 1) {
      const line = document.createElement('div');
      line.classList.add('line');
      for (let j = 0; j < this.sizeY; j += 1) {
        const cell = document.createElement('div');
        cell.id = `cell-${i}-${j}`;
        cell.setAttribute('i', i);
        cell.setAttribute('j', j);
        cell.classList.add('cell', 'closed');
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
    this.startTime = Date.now();
    this.timerId = setInterval(() => {
      const now = Date.now();
      const timeElapsed = Math.floor((now - this.startTime) / 1000);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  createNewGame() {
    this.win = false;
    this.lose = false;
    this.startTime = 0;
    this.moveCount = 0;
    this.generateEmptyMinefield();
    this.resetHtml();
  }

  stopGame() {
    this.gameOn = false;
    this.stopTimer();
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
