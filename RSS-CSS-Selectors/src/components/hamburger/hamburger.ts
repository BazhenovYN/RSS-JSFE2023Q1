import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';
import './_hamburger.scss';
import { emitter, events } from 'components/common/event-emmitter';

export default class Hamburger extends View {
  private status: string;

  constructor() {
    super({ tag: 'button', classes: ['hamburger'] });
    this.status = 'hide';
    this.configureView();
  }

  private configureView(): void {
    for (let i = 0; i < 3; i += 1) {
      const span = new ElementCreator({ tag: 'span' });
      this.viewElement.addInnerElement(span);
    }
    this.setClickEventListener(() => {
      this.status = this.status === 'show' ? 'hide' : 'show';
      if (this.status === 'show') {
        this.viewElement.setCssClasses(['hamburger_show']);
      } else {
        this.viewElement.removeCssClasses(['hamburger_show']);
      }
      emitter.emit(events.showLevelList, this.status);
    });
  }
}
