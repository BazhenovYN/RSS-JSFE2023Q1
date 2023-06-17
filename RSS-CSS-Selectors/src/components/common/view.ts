import { ElementParams } from 'types';
import ElementCreator from 'utils/element-creator';

export default abstract class View {
  protected viewElementCreator: ElementCreator;

  constructor(params: ElementParams) {
    this.viewElementCreator = new ElementCreator(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }
}
