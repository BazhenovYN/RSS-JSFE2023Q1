import './_header.scss';
import ElementCreator from "utils/element-creator";
import { ElementParams } from "types";
import View from "components/common/view";

export default class HeaderView extends View {
  protected viewElement!: ElementCreator;

  constructor() {
    const params: ElementParams = {
      tag: 'header',
      classes: ['header'],
    }
    super(params);
  }
}
