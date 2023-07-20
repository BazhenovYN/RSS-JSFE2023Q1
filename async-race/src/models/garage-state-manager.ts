import Car from 'models/car';
import { createCar, deleteCar, getCars, updateCar } from 'services/garage-service';
import { deleteWinner } from 'services/winners-service';
import { getRandomCarName, getRandomColor } from 'utils/utils';

import type { ICarProps, ICarResponse } from 'types';

const FIRST_PAGE = 1;
const CARS_PER_ONE_PAGE = 7;
const RANDOM_CAR_COUNT = 100;

const generateRandomParams = (): ICarProps => {
  const name = getRandomCarName();
  const color = getRandomColor();
  return { name, color };
};

export default class GarageStateManager {
  public cars: Car[] = [];

  public totalCount: number;

  public currentPage: number;

  public elementsPerOnePage: number;

  constructor() {
    this.totalCount = 0;
    this.currentPage = FIRST_PAGE;
    this.elementsPerOnePage = CARS_PER_ONE_PAGE;
  }

  private generateCars(data: ICarResponse[]): void {
    this.cars = [];
    data.forEach((param) => {
      const newCar = new Car(param.id, param.name, param.color);
      this.cars.push(newCar);
    });
  }

  public async getCars(pageNumber = FIRST_PAGE, reload = false): Promise<void> {
    if (this.cars.length && !reload) {
      return;
    }

    const apiResult = await getCars([
      { key: '_page', value: pageNumber },
      { key: '_limit', value: this.elementsPerOnePage },
    ]);
    this.generateCars(apiResult.data);
    this.totalCount = apiResult.totalCount ? apiResult.totalCount : 0;
    this.currentPage = pageNumber;
  }

  public async getNextCars(): Promise<void> {
    if (this.currentPage * this.elementsPerOnePage < this.totalCount) {
      await this.getCars(this.currentPage + 1, true);
    }
  }

  public async getPreviousCars(): Promise<void> {
    if (this.currentPage > 1) {
      await this.getCars(this.currentPage - 1, true);
    }
  }

  public async createCar(param: ICarProps): Promise<void> {
    await createCar(param);
    await this.getCars(this.currentPage, true);
  }

  public async deleteCar(id: number): Promise<void> {
    await deleteCar(id);
    await deleteWinner(id);
    const pageNumber = this.currentPage > 1 && this.cars.length === 1 ? this.currentPage - 1 : this.currentPage;
    await this.getCars(pageNumber, true);
  }

  public async updateCar(id: number, param: ICarProps): Promise<void> {
    await updateCar(id, param);
    await this.getCars(this.currentPage, true);
  }

  public async generateRandomCars(): Promise<void> {
    const promises: Promise<ICarResponse>[] = [];
    for (let i = 0; i < RANDOM_CAR_COUNT; i += 1) {
      const param = generateRandomParams();
      promises.push(createCar(param));
    }
    await Promise.all(promises);
    await this.getCars(this.currentPage, true);
  }
}
