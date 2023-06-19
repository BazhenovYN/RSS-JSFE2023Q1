import { CallbackFn, ElementParams } from 'types';
import ElementCreator from 'utils/element-creator';

export default abstract class View {
  protected viewElement: ElementCreator;

  constructor(params: ElementParams) {
    this.viewElement = new ElementCreator(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElement.getElement();
  }

  public setCallback(callback: CallbackFn): void {
    this.viewElement.setCallback(callback);
  }
}
