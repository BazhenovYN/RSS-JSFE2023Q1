import { GameProgress, LevelData, LevelStatus } from 'types';
import Level from 'components/common/level';
import LEVEL_DATA from 'data/data';
import emitter from 'components/common/event-emmitter';

function getLevelIdByNumber(levelNumber: number): number {
  return levelNumber; // for now, id is the level number in order
}

export default class LevelManager {
  private currentLevel: Level;

  private progress: GameProgress;

  constructor() {
    this.progress = {
      currentLevelNumber: 0,
      totalLevels: 0,
      currentLevelCompleted: false,
      hint: false,
      score: [],
    };

    this.loadGameProgress();

    const id = getLevelIdByNumber(this.progress.currentLevelNumber);
    this.currentLevel = new Level(id);

    emitter.subscribe('event:help-click', (): void => {
      this.progress.hint = true;
      this.updateScore();
      this.saveGame();
    });
  }

  private loadGameProgress(): void {
    if (!this.loadGame()) {
      this.createNewGame();
    }
  }

  private loadGame(): boolean {
    const progress = localStorage.getItem('progress');
    if (progress) {
      Object.assign(this.progress, JSON.parse(progress));
      return true;
    }
    return false;
  }

  private saveGame(): void {
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }

  public resetProgress(): void {
    localStorage.removeItem('progress');
    this.createNewGame();
  }

  public createNewGame(): void {
    this.currentLevel = new Level();
    this.progress.currentLevelNumber = 1;
    this.progress.totalLevels = LEVEL_DATA.length;
    this.progress.currentLevelCompleted = false;
    this.progress.hint = false;
    this.progress.score = LEVEL_DATA.reduce((acc: LevelStatus[], level: LevelData) => {
      const levelStatus: LevelStatus = {
        id: level.id,
        selector: level.selector,
        completed: false,
        hint: false,
      };
      acc.push(levelStatus);
      return acc;
    }, []);
  }

  public isWin(): boolean {
    return this.progress.score.every((level) => level.completed);
  }

  public isCorrectSelector(container: HTMLElement, selector: string): boolean {
    let userElements;
    try {
      userElements = [...container.querySelectorAll(`${selector}:not(.tooltiptext)`)];
    }
    catch(err) {
      return false;
    }
    
    const answer = this.currentLevel.getAnswer();
    if (userElements.length !== answer.length) {
      return false;
    }

    return userElements.every((element) => {
      if (element instanceof HTMLElement) {
        return answer.includes(element);
      }
      return false;
    });
  }

  public prevLevel(): void {
    if (this.progress.currentLevelNumber > 1) {
      this.progress.currentLevelNumber -= 1;
    }

    const id = getLevelIdByNumber(this.progress.currentLevelNumber);
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
    this.saveGame();
  }

  public nextLevel(currentLevelCompleted = false): void {
    if (currentLevelCompleted) {
      this.updateScore();
    }

    if (this.progress.currentLevelNumber < this.progress.totalLevels) {
      this.progress.currentLevelNumber += 1;
    }

    const id = getLevelIdByNumber(this.progress.currentLevelNumber);
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
    this.saveGame();
  }

  public pickLevel(levelNumber: number): void {
    this.progress.currentLevelNumber = levelNumber;
    const id = getLevelIdByNumber(levelNumber);
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
    this.saveGame();
  }

  private updateLevelStatus(): void {
    const id = this.currentLevel.getLevelId();
    const levelStatus = this.progress.score.find((level) => level.id === id);
    this.progress.currentLevelCompleted = levelStatus?.completed ?? false;
    this.progress.hint = levelStatus?.hint ?? false;
  }

  private updateScore(): void {
    const id = this.currentLevel.getLevelId();
    const levelStatus = this.progress.score.find((level) => level.id === id);
    if (levelStatus) {
      levelStatus.completed = true;
      levelStatus.hint = this.progress.hint;
    }
  }

  public getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public getGameProgress(): GameProgress {
    return this.progress;
  }
}
