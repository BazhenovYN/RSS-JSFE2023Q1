import './normalize.css';
import './style.scss';

import { APP_TITLE, EASY_LEVEL, MEDIUM_LEVEL, HARD_LEVEL } from './const';
import { getRandomInteger } from './utils';

class Board {
  constructor() {
    this.sizeX = 0;
    this.sizeY = 0;
    this.mineCount = 0;
    this.minesRemaining = 0;
    this.timer = 0;
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
    cells.forEach((currElement) => {
      const element = currElement; // recomended eslint
      element.classList.remove('mine', 'bang', 'empty', 'flag', 'mistake');
      element.removeAttribute('value');
      element.classList.add('closed');
      element.innerText = '';
    });
  }

  getCurrentCell(element) {
    const i = Number(element.getAttribute('i'));
    const j = Number(element.getAttribute('j'));
    return this.cells[i][j];
  }

  handleLeftClick(event) {
    if (this.win || this.lose) {
      return;
    }

    const target = event.currentTarget;
    const cell = this.getCurrentCell(target);

    if (cell.flagged) {
      target.classList.remove('flag');
      cell.flagged = false;
      return;
    }

    if (!this.gameOn) {
      this.startNewGame(cell);
    }

    target.classList.remove('closed');
    cell.opened = true;

    if (cell.mined) {
      target.classList.add('mine', 'bang');
      this.gameOver();
    } else if (cell.neighborMineCount > 0) {
      target.innerText = cell.neighborMineCount;
      target.setAttribute('value', cell.neighborMineCount);
    } else if (cell.neighborMineCount = 0) {

    }
  }

  handleRightClick(event) {
    event.preventDefault();
    if (this.win || this.lose) {
      return;
    }

    const target = event.currentTarget;
    target.classList.toggle('flag');

    const cell = this.getCurrentCell(target);
    cell.flagged = !cell.flagged;

    if (cell.flagged) {
      this.minesRemaining -= 1;
      if (this.minesRemaining === 0 && this.isWin()) {
        this.win();
      }
    } else {
      this.minesRemaining += 1;
    }
  }

  isWin() {
    return this.mines.every((cell) => cell.flagged);
  }

  win() {
    this.gameOn = false;
    this.win = true;
  }

  gameOver() {
    this.gameOn = false;
    this.lose = true;
    this.openMines();
    this.checkMistakes();
  }

  openMines() {
    this.mines.filter((cell) => !cell.flagged && !cell.opened).forEach((cell) => {
      const element = this.elements.cells.querySelector(`#cell-${cell.i}-${cell.j}`);
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

  createNewGame() {
    this.gameOn = false;
    this.win = false;
    this.lose = false;
    this.timer = 0;
    this.moveCount = 0;
    this.generateEmptyMinefield();
    this.resetHtml();
  }

  startNewGame(startingCell) {
    this.assignMines(startingCell);
    this.calculateNeighborMineCounts();
    this.gameOn = true;
  }
}

const board = new Board();

window.addEventListener('DOMContentLoaded', () => {
  board.init(EASY_LEVEL);
});
