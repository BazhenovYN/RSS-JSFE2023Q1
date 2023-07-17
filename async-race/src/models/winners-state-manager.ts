import Winner from 'models/winner';
import { getCar } from 'services/garage-service';
import { getWinners } from 'services/winners-service';

import type { ICarResponse, IWinner } from 'types';

const FIRST_PAGE = 1;
const WINNERS_PER_ONE_PAGE = 10;

export default class WinnersStateManager {
  public winners: Winner[] = [];

  public totalCount: number;

  public currentPage: number;

  constructor() {
    this.totalCount = 0;
    this.currentPage = FIRST_PAGE;
  }

  private updateWinner(carProps: ICarResponse): void {
    const winner = this.winners.find((curr) => curr.id === carProps.id);
    if (winner) {
      winner.setCarProps(carProps);
    }
  }

  private async getCarProps(): Promise<void> {
    const promises = this.winners.map((winner) => getCar(winner.id));
    const apiResult = await Promise.allSettled(promises);
    apiResult.forEach((result) => {
      if (result.status === 'fulfilled') {
        this.updateWinner(result.value);
      }
    });
  }

  private generateWinners(data: IWinner[]): void {
    this.winners = [];
    data.forEach((param) => {
      const newWinner = new Winner(param.id, param.wins, param.time);
      this.winners.push(newWinner);
    });
  }

  public async getWinners(pageNumber = FIRST_PAGE): Promise<void> {
    const apiResult = await getWinners([
      { key: '_page', value: pageNumber },
      { key: '_limit', value: WINNERS_PER_ONE_PAGE },
    ]);
    this.generateWinners(apiResult.data);
    this.totalCount = apiResult.totalCount ? apiResult.totalCount : 0;
    this.currentPage = pageNumber;

    await this.getCarProps();
  }
}
