import { path } from 'app/consts';
import { RaceParam, RaceResult } from 'types';
import { patch } from 'utils/utils';

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

export const driveEngine = async (id: number): Promise<boolean> => {
  try {
    const data = await engine<RaceResult>(id, 'drive');
    if (data.success) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};
