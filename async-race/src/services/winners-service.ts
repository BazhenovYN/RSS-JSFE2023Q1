import { path } from 'app/consts';
import { QueryParam, Winner, WinnerProps } from 'types';
import { get, post, put, del } from 'utils/utils';

export const getWinners = (queryParams: QueryParam[]): Promise<Winner[]> => get<Winner[]>(path.winners, queryParams);

export const getWinner = (id: number): Promise<Winner> => get<Winner>(`${path.winners}/${id}`);

export const createWinner = async (param: Winner): Promise<boolean> => {
  const data = await post<Winner, Winner>(path.winners, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof Winner]);
};

export const deleteWinner = async (id: number): Promise<boolean> => {
  await del(`${path.winners}/${id}`);
  return true;
};

export const updateWinner = async (id: number, param: WinnerProps): Promise<boolean> => {
  const data = await put<Winner, WinnerProps>(`${path.garage}/${id}`, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof WinnerProps]);
};
