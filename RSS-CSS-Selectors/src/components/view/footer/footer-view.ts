import ElementCreator from "utils/element-creator";
import { ElementParams } from "types";
import View from "components/view/view";
import './_footer.scss';

export default class FooterView extends View {
  protected viewElementCreator!: ElementCreator;

  constructor() {
    const params: ElementParams = {
      tag: 'footer',
      classNames: ['footer'],
    }
    super(params);
  }
}
