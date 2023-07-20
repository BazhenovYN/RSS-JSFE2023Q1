import { driveEngine, startEngine, stopEngine } from 'services/engine-service';
import type { CarStatus, Color } from 'types';

export default class Car {
  public status: CarStatus = 'stopped';

  public raceTime = 0;

  public finishTime = 0;

  constructor(public readonly id: number, public name: string, public color: Color) {}

  public async startEngine(): Promise<void> {
    this.raceTime = await startEngine(this.id);
    this.finishTime = 0;
    this.status = 'started';
  }

  public async driveEngine(): Promise<void> {
    const isRaceFinish = await driveEngine(this.id);
    if (isRaceFinish) {
      this.status = 'finished';
      this.finishTime = Date.now();
    } else {
      this.status = 'broken';
    }
  }

  public async stopEngine(): Promise<void> {
    const isStoped = await stopEngine(this.id);
    if (isStoped) {
      this.status = 'stopped';
      this.raceTime = 0;
    }
  }
}
