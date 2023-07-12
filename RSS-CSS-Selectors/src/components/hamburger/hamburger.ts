import View from 'components/common/view';
import { emitter, events } from 'components/common/event-emmitter';
import ElementCreator from 'utils/element-creator';

import './_hamburger.scss';

export const menuStatus = {
  hide: 'hide',
  show: 'show',
};

export class Hamburger extends View {
  private status: string;

  constructor() {
    super({ tag: 'button', classes: ['hamburger'] });
    this.status = menuStatus.hide;
    this.configureView();
  }

  private configureView(): void {
    for (let i = 0; i < 3; i += 1) {
      const span = new ElementCreator({ tag: 'span' });
      this.viewElement.addInnerElement(span);
    }
    this.setClickEventListener(() => {
      this.status = this.status === menuStatus.show ? menuStatus.hide : menuStatus.show;
      if (this.status === menuStatus.show) {
        this.viewElement.setCssClasses(['hamburger_show']);
      } else {
        this.viewElement.removeCssClasses(['hamburger_show']);
      }
      emitter.emit(events.showLevelList, this.status);
    });
  }
}
