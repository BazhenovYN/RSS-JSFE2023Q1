import { GameProgress } from 'types';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';

export default class LevelListView extends View {
  private list!: ElementCreator;

  private items = new Map<number, ElementCreator>();

  constructor(progress: GameProgress) {
    super({ tag: 'div', classes: ['levels-wrapper'] });
    this.configureView(progress);
  }

  private configureView(progress: GameProgress): void {
    this.list = new ElementCreator({ tag: 'ol', classes: ['level-list'] });
    this.viewElement.addInnerElement(this.list);
    this.createListItems(progress);
  }

  private createListItems(progress: GameProgress): void {
    progress.score.forEach((level) => {
      const classes = ['level-list__item'];

      if (level.hint) {
        classes.push('hint');
      } else if (level.completed) {
        classes.push('completed')
      };

      const item = new ElementCreator({
        tag: 'li',
        classes,
        textContent: level.selector,
      });

      this.items.set(level.id, item);
      
      this.list.addInnerElement(item);
    });
  }
}
