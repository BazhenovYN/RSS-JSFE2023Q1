import { InputElementParams } from 'types';
import ElementCreator from './element-creator';

export default class InputView extends ElementCreator {
  constructor(params: InputElementParams) {
    super({ tag: 'input', classes: params.classes, attributes: params.attributes });
  }

  public getValue(): string {
    return (this.getElement() as HTMLInputElement).value;
  }

  public setValue(value: string): void {
    (this.getElement() as HTMLInputElement).value = value;
  }
}
