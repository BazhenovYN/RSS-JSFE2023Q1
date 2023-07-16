import { path } from 'app/consts';
import { get, post, put, del } from 'utils/api';

import type { QueryParam, IWinner, IWinnerProps } from 'types';

export const getWinners = async (queryParams: QueryParam[]): Promise<{ data: IWinner[]; totalCount: number | null }> => {
  const { data, totalCount } = await get<IWinner[]>(path.winners, queryParams);
  return { data, totalCount };
};

export const getWinner = async (id: number): Promise<IWinner> => {
  const { data } = await get<IWinner>(`${path.winners}/${id}`);
  return data;
};

export const createWinner = async (param: IWinner): Promise<boolean> => {
  const data = await post<IWinner, IWinner>(path.winners, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof IWinner]);
};

export const deleteWinner = async (id: number): Promise<boolean> => {
  await del(`${path.winners}/${id}`);
  return true;
};

export const updateWinner = async (id: number, param: IWinnerProps): Promise<boolean> => {
  const data = await put<IWinner, IWinnerProps>(`${path.garage}/${id}`, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof IWinnerProps]);
};
