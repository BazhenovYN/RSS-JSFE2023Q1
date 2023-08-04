import { emptyString } from 'app/consts';
import View from 'components/common/view';
import createDomElement from 'utils/element-creator';

import './_pagination.scss';

const FIRST_PAGE = 1;

export default class Pagination extends View {
  protected element: HTMLDivElement;

  private nextButton: HTMLButtonElement;

  private prevButton: HTMLButtonElement;

  constructor() {
    super();
    this.prevButton = createDomElement({
      tag: 'button',
      textContent: 'Prev',
      className: 'btn pagination__prev',
    });
    this.nextButton = createDomElement({
      tag: 'button',
      textContent: 'Next',
      className: 'btn pagination__next',
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

  public update(totalCount: number, currentPage: number, elementsPerOnePage: number): void {
    if (currentPage === FIRST_PAGE) {
      this.prevButton.setAttribute('disabled', emptyString);
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (elementsPerOnePage * currentPage >= totalCount) {
      this.nextButton.setAttribute('disabled', emptyString);
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }
}
