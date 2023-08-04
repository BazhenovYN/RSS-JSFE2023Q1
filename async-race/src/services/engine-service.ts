import { path } from 'app/consts';
import { patch } from 'utils/api';

import type { RaceParam, RaceResult } from 'types';

const ENGINE_STATUS = {
  started: 'started',
  stopped: 'stopped',
  drive: 'drive',
}

const engine = <T>(id: number, status: string): Promise<T> => {
  const queryParams = [
    { key: 'id', value: id },
    { key: 'status', value: status },
  ];
  return patch<T>(path.engine, queryParams);
};

export const startEngine = async (id: number): Promise<number> => {
  const data = await engine<RaceParam>(id, ENGINE_STATUS.started);
  const raceTime = Math.round(data.distance / data.velocity);
  return raceTime;
};

export const stopEngine = async (id: number): Promise<boolean> => {
  const data = await engine<RaceParam>(id, ENGINE_STATUS.stopped);
  return data.velocity === 0;
};

export const driveEngine = async (id: number): Promise<RaceResult> => engine<RaceResult>(id, ENGINE_STATUS.drive);
