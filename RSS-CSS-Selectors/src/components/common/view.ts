import ElementCreator from 'utils/element-creator';
import type { CallbackFn, ElementParams } from 'types';

export default abstract class View {
  protected viewElement: ElementCreator;

  constructor(params: ElementParams) {
    this.viewElement = new ElementCreator(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElement.getElement();
  }

  public setClickEventListener(callback: CallbackFn): void {
    this.viewElement.setClickEventListener(callback);
  }
}
