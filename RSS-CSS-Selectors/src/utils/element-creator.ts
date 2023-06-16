import { CallbackFn, ElementParams } from "types";

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

  public addInnerElement(element: HTMLElement | DocumentFragment | ElementCreator): void {
    if (element instanceof ElementCreator) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  private setCssClasses(cssClasses: string[] = []): void {
    this.element.classList.add(...cssClasses);
  }

  private setTextContent(text = ''): void {
    this.element.textContent = text;
  }

  private setCallback(callback: CallbackFn | undefined): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }
}
