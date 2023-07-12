import { path } from 'app/consts';
import { QueryParam, Car, CarProps } from 'types';
import { get, post, put, del } from 'utils/utils';

export const getCars = (queryParams: QueryParam[]): Promise<Car[]> => get<Car[]>(path.garage, queryParams);

export const getCar = (id: number): Promise<Car> => get<Car>(`${path.garage}/${id}`);

export const createCar = async (param: CarProps): Promise<boolean> => {
  const data = await post<Car, CarProps>(path.garage, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof CarProps]);
};

export const deleteCar = async (id: number): Promise<boolean> => {
  await del(`${path.garage}/${id}`);
  return true;
};

export const updateCar = async (id: number, param: CarProps): Promise<boolean> => {
  const data = await put<Car, CarProps>(`${path.garage}/${id}`, param);
  return Object.entries(param).every(([key, value]) => value === data[key as keyof CarProps]);
};
