import type { Color, ICarResponse, IWinner } from 'types';

const DEFAULT_COLOR = '#ffffff'; // white
const DEFAULT_NAME = '<unknown>';

export default class Winner implements IWinner {
  public name: string;

  public color: Color;

  constructor(public readonly id: number, public wins: number, public time: number) {
    this.name = DEFAULT_NAME;
    this.color = DEFAULT_COLOR;
  }

  public setCarProps(carProps: ICarResponse): void {
    this.name = carProps.name;
    this.color = carProps.color;
  }
}
