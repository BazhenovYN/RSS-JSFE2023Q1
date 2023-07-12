import View from 'components/common/view';
import { emitter, events } from 'components/common/event-emmitter';
import ElementCreator from 'utils/element-creator';

import type { GameProgress } from 'types';

export default class LevelListView extends View {
  private list!: ElementCreator;

  private items = new Map<number, ElementCreator>();

  public resetButton!: ElementCreator;

  constructor(progress: GameProgress) {
    super({ tag: 'div', classes: ['levels-wrapper'] });
    this.configureView(progress);
    emitter.subscribe(events.showLevelList, (status: string) => this.showList(status));
  }

  private configureView(progress: GameProgress): void {
    const title = new ElementCreator({
      tag: 'div',
      classes: ['level-title'],
      textContent: 'Choose a level'
    });
    this.list = new ElementCreator({ tag: 'ol', classes: ['level-list'] });
    this.resetButton = new ElementCreator({
      tag: 'button',
      classes: ['btn', 'level-reset'],
      textContent: 'Reset progress',
    });
    this.viewElement.addInnerElement(title, this.list, this.resetButton);
    this.createListItems(progress);
  }

  private createListItems(progress: GameProgress): void {
    progress.score.forEach((level) => {
      const classes = ['level-list__item'];

      if (level.completed) {
        classes.push('level-list__item_completed');
      }

      if (level.hint) {
        classes.push('level-list__item_hint');
      }

      if (progress.currentLevelNumber === level.id) {
        classes.push('level-list__item_current');
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

  public update(progress: GameProgress): void {
    progress.score.forEach((level) => {
      const item = this.items.get(level.id);
      if (!item) return;

      if (level.completed) {
        item.setCssClasses(['level-list__item_completed']);
      } else {
        item.removeCssClasses(['level-list__item_completed'])
      }
      if (level.hint) {
        item.setCssClasses(['level-list__item_hint']);
      } else {
        item.removeCssClasses(['level-list__item_hint']);
      }

      if (progress.currentLevelNumber === level.id) {
        item.setCssClasses(['level-list__item_current']);
      } else {
        item.removeCssClasses(['level-list__item_current']);
      }
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
