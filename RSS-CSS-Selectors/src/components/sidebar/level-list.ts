import { GameProgress } from 'types';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';
import emitter from 'components/common/event-emmitter';

export default class LevelListView extends View {
  private list!: ElementCreator;

  private items = new Map<number, ElementCreator>();

  public resetButton!: ElementCreator;

  constructor(progress: GameProgress) {
    super({ tag: 'div', classes: ['levels-wrapper'] });
    this.configureView(progress);
    emitter.subscribe('event:show-level-list', (status: string) => this.showList(status));
  }

  private configureView(progress: GameProgress): void {
    this.list = new ElementCreator({ tag: 'ol', classes: ['level-list'] });
    this.resetButton = new ElementCreator({
      tag: 'button',
      classes: ['btn', 'level-reset'],
      textContent: 'Reset progress',
    });
    this.viewElement.addInnerElement(this.list, this.resetButton);
    this.createListItems(progress);
  }

  private createListItems(progress: GameProgress): void {
    progress.score.forEach((level) => {
      const classes = ['level-list__item'];

      if (level.hint) {
        classes.push('hint');
      } else if (level.completed) {
        classes.push('completed');
      }

      const item = new ElementCreator({
        tag: 'li',
        classes,
        textContent: level.selector,
        attributes: { 'data-level': String(level.id) },
      });

      this.items.set(level.id, item);

      this.list.addInnerElement(item);
    });
  }

  private showList(status: string): void {
    if (status === 'show') {
      this.viewElement.setCssClasses(['levels-wrapper_show']);
    } else {
      this.viewElement.removeCssClasses(['levels-wrapper_show']);
    }
  }
}
