import './_sidebar.scss';
import { GameProgress } from 'types';
import View from 'components/common/view';
import Menu from 'components/menu/menu';
import Level from 'components/common/level';
import Help from './help';
import LevelListView from './level-list';

export default class Sidebar extends View {
  private menu!: Menu;

  private help!: Help;

  private levelList!: Menu;

  constructor(currentLevel: Level, progress: GameProgress) {
    super({ tag: 'div', classes: ['sidebar'] });
    this.configureView(currentLevel, progress);
  }

  private configureView(currentLevel: Level, progress: GameProgress): void {
    this.menu = new Menu();
    this.help = new Help(currentLevel);
    this.levelList = new LevelListView(progress);

    this.viewElement.addInnerElement(
      this.menu.getHtmlElement(),
      this.help.getHtmlElement(),
      this.levelList.getHtmlElement(),
    );
  }
}
