import Car from 'models/car';
import { createCar, deleteCar, getCars, updateCar } from 'services/garage-service';
import { deleteWinner } from 'services/winners-service';
import type { ICarProps, ICarResponse } from 'types';

const FIRST_PAGE = 1;
const CARS_PER_ONE_PAGE = 7;

export default class GarageStateManager {
  private cars: Car[] = [];

  private totalCount: number;

  private currentPage: number;

  constructor() {
    this.totalCount = 0;
    this.currentPage = FIRST_PAGE;
  }

  private generateCars(data: ICarResponse[]): void {
    this.cars = [];
    data.forEach((param) => {
      const newCar = new Car(param.id, param.name, param.color);
      this.cars.push(newCar);
    });
  }

  public async getCars(pageNumber = FIRST_PAGE): Promise<void> {
    const apiResult = await getCars([
      { key: '_page', value: pageNumber },
      { key: '_limit', value: CARS_PER_ONE_PAGE },
    ]);
    this.generateCars(apiResult.data);
    this.totalCount = apiResult.totalCount ? apiResult.totalCount : 0;
    this.currentPage = pageNumber;
  }

  public async createCar(param: ICarProps): Promise<void> {
    const data = await createCar(param);
    const newCar = new Car(data.id, data.name, data.color);
    this.cars.push(newCar);
    this.totalCount += 1;
  }

  public async deleteCar(id: number): Promise<void> {
    await deleteCar(id);
    await deleteWinner(id);
    this.cars = this.cars.filter((car) => car.id !== id);
    this.totalCount -= 1;
  }

  public async updateCar(id: number, param: ICarProps): Promise<void> {
    await updateCar(id, param);
    const car = this.cars.find((currCar) => currCar.id === id);
    if (car) {
      car.updateProps(param);
    }
  }
}
