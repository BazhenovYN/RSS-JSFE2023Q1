import View from 'components/common/view';
import Menu from 'components/menu/menu';
import Level from 'components/common/level';
import { Hamburger } from 'components/hamburger';
import type { CallbackFn, GameProgress } from 'types';
import Help from './help';
import LevelListView from './level-list';

import './_sidebar.scss';

export default class Sidebar extends View {
  private menu!: Menu;

  private help!: Help;

  private levelList!: LevelListView;

  private hamburger!: Hamburger;

  constructor(currentLevel: Level, progress: GameProgress) {
    super({ tag: 'div', classes: ['sidebar'] });
    this.configureView(currentLevel, progress);
  }

  private configureView(currentLevel: Level, progress: GameProgress): void {
    this.hamburger = new Hamburger();
    this.menu = new Menu(progress);
    this.help = new Help(currentLevel, progress);
    this.levelList = new LevelListView(progress);

    this.viewElement.addInnerElement(
      this.hamburger.getHtmlElement(),
      this.menu.getHtmlElement(),
      this.help.getHtmlElement(),
      this.levelList.getHtmlElement(),
    );
  }

  public update(currentLevel: Level, progress: GameProgress): void {
    this.menu.update(progress);
    this.help.update(currentLevel, progress);
    this.levelList.update(progress);
  }

  public setPickLevelListener(callback: CallbackFn): void {
    this.levelList.setClickEventListener(callback);
  }

  public setNextLevelListener(callback: CallbackFn): void {
    this.menu.nextButton.setClickEventListener(callback);
  }

  public setPrevLevelListener(callback: CallbackFn): void {
    this.menu.prevButton.setClickEventListener(callback);
  }

  public setResetListener(callback: CallbackFn): void {
    this.levelList.resetButton.setClickEventListener(callback);
  }
}
