import HeaderView from 'components/header/header';
import MainView from 'components/main/main';
import FooterView from 'components/footer/footer';
import Sidebar from 'components/sidebar/sidebar';
import LevelManager from 'components/common/level-manager';
import ElementCreator from 'utils/element-creator';

export default class App {
  private levelManager: LevelManager;

  private main: MainView;

  private header: HeaderView;

  private footer: FooterView;

  private sidebar: Sidebar;

  constructor() {
    this.levelManager = new LevelManager();
    const currentLevel = this.levelManager.getCurrentLevel();
    const gameProgress = this.levelManager.getGameProgress();

    this.header = new HeaderView();
    this.main = new MainView(currentLevel);
    this.sidebar = new Sidebar(currentLevel, gameProgress);
    this.footer = new FooterView();
  }

  public start(): void {
    const wrapper = new ElementCreator({ tag: 'div', classes: ['wrapper'] });
    wrapper.addInnerElement(
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      this.sidebar.getHtmlElement(),
      this.footer.getHtmlElement(),
    );
    document.body.append(wrapper.getElement());
    this.setListeners();
  }

  private update(): void {
    const currentLevel = this.levelManager.getCurrentLevel();
    const gameProgress = this.levelManager.getGameProgress();

    this.main.createLevel(currentLevel);
    this.sidebar.update(currentLevel, gameProgress);
  }

  private pickLevelHandler(event: MouseEvent): void {
    let level = 0;
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLElement) {
      level = Number(eventTarget.getAttribute('level')) ?? 0;
    }

    if (level > 0) {
      this.levelManager.pickLevel(level);
      this.update();
    }
  }

  private nextLevelHandler(): void {
    this.levelManager.nextLevel();
    this.update();
  }

  private prevLevelHandler(): void {
    this.levelManager.prevLevel();
    this.update();
  }

  private setListeners(): void {
    this.sidebar.setPickLevelListener(this.pickLevelHandler.bind(this));
    this.sidebar.setNextLevelListener(this.nextLevelHandler.bind(this));
    this.sidebar.setPrevLevelListener(this.prevLevelHandler.bind(this));
  }
}
