import LEVEL_DATA from 'data/data';
import Level from 'components/common/level';
import { emitter, events } from 'components/common/event-emmitter';
import type { GameProgress, LevelData, LevelStatus } from 'types';

const GAME_PROGRESS = 'progress';
const FIRST_LEVEL = 1;
const STEP = 1;

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

    const id = this.progress.currentLevelNumber;
    this.currentLevel = new Level(id);

    emitter.subscribe(events.helpClick, (): void => {
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
    const progress = localStorage.getItem(GAME_PROGRESS);
    if (progress) {
      Object.assign(this.progress, JSON.parse(progress));
      return true;
    }
    return false;
  }

  private saveGame(): void {
    localStorage.setItem(GAME_PROGRESS, JSON.stringify(this.progress));
  }

  public resetProgress(): void {
    localStorage.removeItem(GAME_PROGRESS);
    this.createNewGame();
  }

  public createNewGame(): void {
    this.currentLevel = new Level();
    this.progress.currentLevelNumber = FIRST_LEVEL;
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
    } catch (err) {
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
    if (this.progress.currentLevelNumber > FIRST_LEVEL) {
      this.progress.currentLevelNumber -= STEP;
    }

    const id = this.progress.currentLevelNumber;
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
    this.saveGame();
  }

  public nextLevel(currentLevelCompleted = false): void {
    if (currentLevelCompleted) {
      this.updateScore();
    }

    if (this.progress.currentLevelNumber < this.progress.totalLevels) {
      this.progress.currentLevelNumber += STEP;
    }

    const id = this.progress.currentLevelNumber;
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
    this.saveGame();
  }

  public pickLevel(levelNumber: number): void {
    this.progress.currentLevelNumber = levelNumber;
    this.currentLevel = new Level(levelNumber);
    this.updateLevelStatus();
    this.saveGame();
  }

  private getLevelStatus(): LevelStatus | undefined {
    const id = this.currentLevel.getLevelId();
    return this.progress.score.find((level) => level.id === id);
  }

  private updateLevelStatus(): void {
    const levelStatus = this.getLevelStatus();
    this.progress.currentLevelCompleted = levelStatus?.completed ?? false;
    this.progress.hint = levelStatus?.hint ?? false;
  }

  private updateScore(): void {
    const levelStatus = this.getLevelStatus();
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
