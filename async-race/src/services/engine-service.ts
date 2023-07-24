import { path } from 'app/consts';
import { patch } from 'utils/api';

import type { RaceParam, RaceResult } from 'types';

const engine = <T>(id: number, status: string): Promise<T> => {
  const queryParams = [
    { key: 'id', value: id },
    { key: 'status', value: status },
  ];
  return patch<T>(path.engine, queryParams);
};

export const startEngine = async (id: number): Promise<number> => {
  const data = await engine<RaceParam>(id, 'started');
  const raceTime = Math.round(data.distance / data.velocity);
  return raceTime;
};

export const stopEngine = async (id: number): Promise<boolean> => {
  const data = await engine<RaceParam>(id, 'stopped');
  if (data.velocity === 0) {
    return true;
  }
  return false;
};

export const driveEngine = async (id: number): Promise<RaceResult> => engine<RaceResult>(id, 'drive');
