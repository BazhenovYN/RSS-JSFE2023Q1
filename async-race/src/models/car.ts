import { driveEngine, startEngine, stopEngine } from 'services/engine-service';
import { createWinner, getWinner, updateWinner } from 'services/winners-service';
import type { CarStatus, Color } from 'types';

export default class Car {
  public status: CarStatus = 'stopped';

  public raceTime = 0;

  public finishTime = 0;

  public totalTime = 0;

  constructor(public readonly id: number, public name: string, public color: Color) {}

  public async startEngine(): Promise<void> {
    this.raceTime = await startEngine(this.id);
    this.finishTime = 0;
    this.status = 'started';
  }

  public async driveEngine(): Promise<void> {
    return new Promise((resolve, reject) => {
      driveEngine(this.id)
        .then(() => {
          this.finishTime = Date.now();
          resolve();
        })
        .catch(() => {
          this.status = 'broken';
          reject(new Error('Engine was broken down'));
        });
    });
  }

  public async stopEngine(): Promise<void> {
    const isStoped = await stopEngine(this.id);
    if (isStoped) {
      this.status = 'stopped';
      this.raceTime = 0;
    }
  }

  public async saveResult(startTime: number): Promise<void> {
    this.totalTime = (this.finishTime - startTime) / 1000;
    const { wins, time } = await getWinner(this.id);
    if (wins) {
      await updateWinner(this.id, {
        wins: wins + 1,
        time: time && time < this.totalTime ? time : this.totalTime,
      });
    } else {
      await createWinner({ id: this.id, wins: 1, time: this.totalTime });
    }
  }
}
