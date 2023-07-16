import { path } from 'app/consts';
import { del, get, post, put } from 'utils/api';

import type { ICarProps, ICarResponse, QueryParam } from 'types';

export const getCars = async (queryParams: QueryParam[]): Promise<{ data: ICarResponse[]; totalCount: number | null }> => {
  const { data, totalCount } = await get<ICarResponse[]>(path.garage, queryParams);
  return { data, totalCount };
};

export const getCar = async (id: number): Promise<ICarResponse> => {
  const { data } = await get<ICarResponse>(`${path.garage}/${id}`);
  return data;
};

export const createCar = async (param: ICarProps): Promise<ICarResponse> => post<ICarResponse, ICarProps>(path.garage, param);

export const deleteCar = async (id: number): Promise<boolean> => {
  await del(`${path.garage}/${id}`);
  return true;
};

export const updateCar = async (id: number, param: ICarProps): Promise<boolean> => {
  const data = await put<ICarResponse, ICarProps>(`${path.garage}/${id}`, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof ICarProps]);
};
