import { CallbackFn, ElementParams } from 'types';

export default class ElementCreator {
  private element: HTMLElement;

  constructor(params: ElementParams) {
    this.element = document.createElement(params.tag);
    this.setCssClasses(params.classes);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement<T extends ElementCreator | HTMLElement | DocumentFragment>(...elements: T[]): void {
    elements.forEach((element) => {
      if (element instanceof ElementCreator) {
        this.element.append(element.getElement());
      }
      if (element instanceof HTMLElement || element instanceof DocumentFragment) {
        this.element.append(element);
      }
    });
  }

  public setCssClasses(cssClasses: string[] = []): void {
    this.element.classList.add(...cssClasses);
  }

  public setTextContent(text = ''): void {
    this.element.textContent = text;
  }

  private setCallback(callback: CallbackFn | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }
}
