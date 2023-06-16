import './_footer.scss';
import ElementCreator from 'utils/element-creator';
import { ElementParams } from 'types';
import View from 'components/view/view';

export default class FooterView extends View {
  protected viewElementCreator!: ElementCreator;

  constructor() {
    const params: ElementParams = {
      tag: 'footer',
      classes: ['footer'],
    };
    super(params);
  }
}
