import { GameProgress, LevelData, LevelStatus } from 'types';
import Level from 'components/common/level';
import LEVEL_DATA from 'data/data';

function getLevelIdByNumber(levelNumber: number): number {
  return levelNumber; // for now, id is the level number in order
}

export default class LevelManager {
  private currentLevel: Level;

  private progress: GameProgress;

  constructor() {
    this.currentLevel = new Level();
    this.progress = {
      currentLevelNumber: 0,
      totalLevels: 0,
      currentLevelCompleted: false,
      score: [],
    }
    this.loadGameProgress();
  }

  private loadGameProgress(): void {
    this.resetProgress();
  }

  public resetProgress(): void {
    this.currentLevel = new Level();
    this.progress.currentLevelNumber = 1;
    this.progress.totalLevels = LEVEL_DATA.length;
    this.progress.currentLevelCompleted = false;
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

  // private loadGame(): void {
  // }

  // private saveGame(): void {
  // }

  // public checkUserSelector(selector: string): boolean {
  // }

  public previousLevel(): void {
    if (this.progress.currentLevelNumber > 1) {
      this.progress.currentLevelNumber -= 1;
    }

    const id = getLevelIdByNumber(this.progress.currentLevelNumber);
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
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
  }

  public pickLevel(levelNumber: number): void {
    this.progress.currentLevelNumber = levelNumber;
    const id = getLevelIdByNumber(levelNumber);
    this.currentLevel = new Level(id);
    this.updateLevelStatus();
  }

  private updateLevelStatus(): void {
    const id = this.currentLevel.getLevelId();
    const levelStatus = this.progress.score.find((level) => level.id === id);
    this.progress.currentLevelCompleted = levelStatus?.completed ?? false;
  }

  private updateScore(): void {
    const id = this.currentLevel.getLevelId();
    const levelStatus = this.progress.score.find((level) => level.id === id);
    if (levelStatus) {
      levelStatus.completed = true;
    }
    // saveGame(); // TODO: сохранение игры при прохождении очередного уровня
  }

  public getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public getGameProgress(): GameProgress {
    return this.progress;
  }
}
