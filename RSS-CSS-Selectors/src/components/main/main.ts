import './_main.scss';
import View from 'components/common/view';
import Level from 'components/common/level';
import ElementCreator from 'utils/element-creator';

export default class MainView extends View {
  private tableWrapper!: ElementCreator;

  constructor(currentLevel: Level) {
    super({ tag: 'main', classes: ['main'] });
    this.configureView();
    this.createLevel(currentLevel);
  }

  public createLevel(currentLevel: Level): void {
    const table = this.tableWrapper.getElement();
    while (table.firstElementChild) {
      table.firstElementChild.remove();
    }

    const levelView = currentLevel.getLevelVisualisation();
    this.tableWrapper.addInnerElement(levelView);
  }

  private configureView(): void {
    const gameWrapper = new ElementCreator({ tag: 'div', classes: ['game-wrapper'] });
    this.tableWrapper = new ElementCreator({ tag: 'div', classes: ['table-wrapper'] });
    gameWrapper.addInnerElement(this.tableWrapper);

    this.viewElementCreator.addInnerElement(gameWrapper);
  }
}
