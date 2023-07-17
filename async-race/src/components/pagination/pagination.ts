import View from 'components/common/view';
import createDomElement from 'utils/element-creator';

import './_pagination.scss';

export default class Pagination extends View {
  protected element: HTMLDivElement;

  constructor() {
    super();
    this.element = createDomElement({
      tag: 'div',
      className: 'pagination',
      children: [
        {
          tag: 'button',
          textContent: 'Prev',
          className: 'pagination__prev',
        },
        {
          tag: 'button',
          textContent: 'Next',
          className: 'pagination__next',
        },
      ],
    });
  }
}
