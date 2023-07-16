import { driveEngine, startEngine, stopEngine } from 'services/engine-service';
import type { CarStatus, Color, Func, ICarProps } from 'types';

export default class Car {
  // private speed = 0;

  private status: CarStatus = 'stopped';

  // private raceCompletionPercentage = 0;

  constructor(public readonly id: number, public name: string, public color: Color) {}

  public async start(startAnimation: Func<number>, stopAnimation: Func): Promise<void> {
    const raceTime = await startEngine(this.id);
    if (raceTime) {
      this.status = 'started';
      startAnimation(raceTime);
      const isRaceFinish = await driveEngine(this.id);
      if (!isRaceFinish) {
        this.status = 'broken';
        stopAnimation();
      }
    }
  }

  public async stop(stopAnimation: Func): Promise<void> {
    const isStoped = await stopEngine(this.id);
    if (isStoped) {
      this.status = 'stopped';
      stopAnimation();
    }
  }

  public updateProps(param: ICarProps): void {
    this.name = param.name;
    this.color = param.color;
  }
}
