import View from 'components/common/view';
import createDomElement from 'utils/element-creator';

import './_pagination.scss';

export default class Pagination extends View {
  protected element: HTMLDivElement;

  private nextButton: HTMLButtonElement;

  private prevButton: HTMLButtonElement;

  constructor() {
    super();
    this.prevButton = createDomElement({
      tag: 'button',
      textContent: 'Prev',
      className: 'pagination__prev',
    });
    this.nextButton = createDomElement({
      tag: 'button',
      textContent: 'Next',
      className: 'pagination__next',
    });
    this.element = createDomElement({
      tag: 'div',
      className: 'pagination',
      children: [this.prevButton, this.nextButton],
    });
  }

  public addHandlers(prev: () => void, next: () => void): void {
    this.prevButton.addEventListener('click', prev);
    this.nextButton.addEventListener('click', next);
  }
}
