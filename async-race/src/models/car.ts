import { CAR_STATUS, MILLISECONDS_IN_SECOND } from 'app/consts';
import { driveEngine, startEngine, stopEngine } from 'services/engine-service';
import { createWinner, getWinner, updateWinner } from 'services/winners-service';
import type { Color } from 'types';

const ONE_WIN = 1;

export default class Car {
  public status = CAR_STATUS.stopped;

  public raceTime = 0;

  public finishTime = 0;

  public totalTime = 0;

  constructor(public readonly id: number, public name: string, public color: Color) {}

  public async startEngine(): Promise<void> {
    this.raceTime = await startEngine(this.id);
    this.finishTime = 0;
    this.status = CAR_STATUS.started;
  }

  public async driveEngine(): Promise<void> {
    return new Promise((resolve, reject) => {
      driveEngine(this.id)
        .then(() => {
          this.finishTime = Date.now();
          resolve();
        })
        .catch(() => {
          this.status = CAR_STATUS.broken;
          reject(new Error('Engine was broken down'));
        });
    });
  }

  public async stopEngine(): Promise<void> {
    const isStoped = await stopEngine(this.id);
    if (isStoped) {
      this.status = CAR_STATUS.stopped;
      this.raceTime = 0;
    }
  }

  public async saveResult(startTime: number): Promise<void> {
    this.totalTime = (this.finishTime - startTime) / MILLISECONDS_IN_SECOND;
    const { wins, time } = await getWinner(this.id);
    if (wins) {
      await updateWinner(this.id, {
        wins: wins + ONE_WIN,
        time: time && time < this.totalTime ? time : this.totalTime,
      });
    } else {
      await createWinner({ id: this.id, wins: ONE_WIN, time: this.totalTime });
    }
  }
}
