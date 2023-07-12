import type { CallbackFn, ElementParams, Attribute } from 'types';

export default class ElementCreator {
  private element: HTMLElement;

  constructor(params: ElementParams) {
    this.element = document.createElement(params.tag);
    this.setId(params.id);
    this.setCssClasses(params.classes);
    this.setTextContent(params.textContent);
    this.setAttributes(params.attributes);
    this.setEventListener('click', params.callback);
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

  public setId(id = ''): void {
    if (id) {
      this.element.id = id;
    }
  }

  public setCssClasses(cssClasses: string[] = []): void {
    if (cssClasses.length) {
      this.element.classList.add(...cssClasses);
    }
  }

  public removeCssClasses(cssClasses: string[] = []): void {
    this.element.classList.remove(...cssClasses);
  }

  public setTextContent(text = ''): void {
    this.element.textContent = text;
  }

  public setInnerHTML(text = ''): void {
    this.element.innerHTML = text;
  }

  public setAttributes(attributes: Attribute | undefined): void {
    if (!attributes) return;

    Object.entries(attributes).forEach(([key, value]) => {
      this.element.setAttribute(key, value);
    });
  }

  public setEventListener<K extends keyof HTMLElementEventMap>(eventType: K, callback?: CallbackFn): void {
    if (typeof callback === 'function') {
      this.element.addEventListener(eventType, (event) => callback(event));
    }
  }
}
