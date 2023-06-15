import ElementCreator from "utils/element-creator";
import { ElementParams } from "types";
import View from "components/view/view";

export default class HeaderView extends View {
  protected viewElementCreator!: ElementCreator;

  constructor() {
    const params: ElementParams = {
      tag: 'main',
      classNames: ['main'],
    }
    super(params);
  }
}
