import './normalize.css';
import './style.scss';

import { EASY_LEVEL, MEDIUM_LEVEL, HARD_LEVEL } from './const';
import { getRandomInteger } from './utils';

class Board {
  constructor() {
    this.sizeX = 0;
    this.sizeY = 0;
    this.mineCount = 0;
    this.minesRemaining = 0;
    this.timer = 0;
    this.moveCount = 0;
    this.cells = [];
    this.elements = {
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
          opened: false,
          flagged: false,
          mined: false,
          neighborMineCount: 0,
        };
      }
    }
  }

  generateHtml() {
    this.elements.cells = document.createElement('div');
    this.elements.cells.classList.add('cells');
    this.elements.cells.appendChild(this.createMineField());
    document.body.appendChild(this.elements.cells);
  }

  createMineField() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.sizeX; i += 1) {
      const line = document.createElement('div');
      line.classList.add('line');
      for (let j = 0; j < this.sizeY; j += 1) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'closed');
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
      if (!this.cells[i][j].mined && startingCell.i !== i && startingCell.j !== j) {
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
            count = cells[i][j].mined ? count += 1 : count;
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

  showMinefield() {
    for (let i = 0; i < this.sizeX; i += 1) {
      let str = '';
      for (let j = 0; j < this.sizeY; j += 1) {
        if (this.cells[i][j].mined) {
          str += '\tm\t';
        } else {
          str += `\t${this.cells[i][j].neighborMineCount}\t`;
        }
      }
      console.log(str);
    }
  }

  startNewGame(startingCell) {
    this.assignMines(startingCell);
    this.calculateNeighborMineCounts();
  }
}

const board = new Board();

window.addEventListener('DOMContentLoaded', () => {
  board.init(EASY_LEVEL);
  // DELETE {
  const startingCell = {
    i: 5,
    j: 5,
  };
  board.startNewGame(startingCell);
  // } DELETE
});
