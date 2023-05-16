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
    this.generateMinefieldCells();
    this.generateHtml();
  }

  generateMinefieldCells() {
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
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('container');

    const title = document.createElement('h1');
    title.innerText = APP_TITLE;
    title.classList.add('title');

    this.elements.cells = document.createElement('div');
    this.elements.cells.classList.add('cells');
    this.elements.cells.appendChild(this.createMinefield());

    this.elements.main.appendChild(title);
    this.elements.main.appendChild(this.elements.cells);
    document.body.appendChild(this.elements.main);
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
  }

  win() {
    this.win = true;
  }

  gameOver() {
    this.lose = true;
    this.mines.forEach((cell) => {
      if (!this.cells[cell.i][cell.j].flagged && !this.cells[cell.i][cell.j].opened) {
        const element = this.elements.cells.querySelector(`#cell-${cell.i}-${cell.j}`);
        element.classList.remove('closed');
        element.classList.add('mine');
      }
    });
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
    while (this.minesRemaining < this.mineCount) {
      const i = getRandomInteger(0, this.sizeX - 1);
      const j = getRandomInteger(0, this.sizeY - 1);
      if (!this.cells[i][j].mined
        && startingCell.i !== i
        && startingCell.j !== j
      ) {
        this.mines.push({ i, j });
        this.cells[i][j].mined = true;
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

  startNewGame(startingCell) {
    this.gameOn = true;
    this.assignMines(startingCell);
    this.calculateNeighborMineCounts();
  }
}

const board = new Board();

window.addEventListener('DOMContentLoaded', () => {
  board.init(EASY_LEVEL);
});
