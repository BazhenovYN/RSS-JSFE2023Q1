import './_sidebar.scss';
import View from 'components/common/view';
import Menu from 'components/menu/menu';
import Help from './help';
import LevelList from './level-list';

export default class Sidebar extends View {
  constructor() {
    super({ tag: 'div', classes: ['sidebar'] });
    this.configureView();
  }

  private configureView(): void {
    const menu = new Menu();
    this.viewElementCreator.addInnerElement(menu.getHtmlElement());

    const help = new Help();
    this.viewElementCreator.addInnerElement(help.getHtmlElement());

    const levelList = new LevelList();
    this.viewElementCreator.addInnerElement(levelList.getHtmlElement());
  }
}