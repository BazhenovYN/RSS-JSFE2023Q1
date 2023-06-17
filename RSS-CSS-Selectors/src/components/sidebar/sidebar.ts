import './_sidebar.scss';
import { GameProgress } from 'types';
import View from 'components/common/view';
import Menu from 'components/menu/menu';
import Level from 'components/common/level';
import Help from './help';
import LevelListView from './level-list';

export default class Sidebar extends View {
  constructor(currentLevel: Level, progress: GameProgress) {
    super({ tag: 'div', classes: ['sidebar'] });
    this.configureView(currentLevel, progress);
  }

  private configureView(currentLevel: Level, progress: GameProgress): void {
    const menu = new Menu();
    this.viewElementCreator.addInnerElement(menu.getHtmlElement());

    const help = new Help(currentLevel);
    this.viewElementCreator.addInnerElement(help.getHtmlElement());

    const levelList = new LevelListView(progress);
    this.viewElementCreator.addInnerElement(levelList.getHtmlElement());
  }
}
