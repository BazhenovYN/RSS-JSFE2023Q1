import Page from 'components/common/page';
import Car from 'models/car';
import { createCar, deleteCar, getCars, updateCar } from 'services/garage-service';
import { deleteWinner } from 'services/winners-service';
import type { ICarProps, ICarResponse } from 'types';

const FIRST_PAGE = 1;
const CARS_PER_ONE_PAGE = 7;

export default class GarageStateManager {
  public cars: Car[] = [];

  public totalCount: number;

  public currentPage: number;

  private carsPerOnePage: number;

  constructor(private page: Page) {
    this.totalCount = 0;
    this.currentPage = FIRST_PAGE;
    this.carsPerOnePage = CARS_PER_ONE_PAGE;

    this.page.addPaginationHandler(this.getPreviousCars.bind(this), this.getNextCars.bind(this));
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
      { key: '_limit', value: this.carsPerOnePage },
    ]);
    this.generateCars(apiResult.data);
    this.totalCount = apiResult.totalCount ? apiResult.totalCount : 0;
    this.currentPage = pageNumber;

    this.page.renderPage(this);
  }

  public getNextCars(): void {
    if (this.currentPage * this.carsPerOnePage < this.totalCount) {
      this.getCars(this.currentPage + 1, true);
    }
  }

  public getPreviousCars(): void {
    if (this.currentPage > 1) {
      this.getCars(this.currentPage - 1, true);
    }
  }

  public async createCar(param: ICarProps): Promise<void> {
    await createCar(param);
    await this.getCars(this.currentPage, true);
  }

  public async deleteCar(id: number): Promise<void> {
    await deleteCar(id);
    await deleteWinner(id);
    await this.getCars(this.currentPage, true);
  }

  public async updateCar(id: number, param: ICarProps): Promise<void> {
    await updateCar(id, param);
    await this.getCars(this.currentPage, true);
  }
}
