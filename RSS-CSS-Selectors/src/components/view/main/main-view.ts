import './_main.scss';
import View from 'components/view/view';
import Level from 'components/levels/level';
import ElementCreator from 'utils/element-creator';

export default class MainView extends View {
  private tableWrapper!: ElementCreator;

  private currentLevel!: Level;

  constructor() {
    super({ tag: 'main', classes: ['main'] });
    this.configureView();
  }


  private loadLevel(): void {
    const table = this.tableWrapper.getElement();
    while (table.firstElementChild) {
      table.firstElementChild.remove();
    }

    this.currentLevel = new Level(1);
    const levelView = this.currentLevel.getLevelVisualisation();
    this.tableWrapper.addInnerElement(levelView);
  }

  private configureView(): void {
    const gameWrapper = new ElementCreator({ tag: 'div', classes: ['game-wrapper'] });
    this.tableWrapper = new ElementCreator({ tag: 'div', classes: ['table-wrapper'] });
    gameWrapper.addInnerElement(this.tableWrapper);

    this.viewElementCreator.addInnerElement(gameWrapper);

    this.loadLevel();
  }
}
