import Page from 'components/common/page';
import GarageStateManager from 'models/garage-state-manager';
import WinnersStateManager from 'models/winners-state-manager';
import GaragePage from 'pages/garage';
import WinnersPage from 'pages/winners';
import createDomElement from 'utils/element-creator';

export default class App {
  private garagePage: GaragePage;

  private winnersPage: WinnersPage;

  private pages: HTMLDivElement;

  private garageStateManager: GarageStateManager;

  private winnersStateManager: WinnersStateManager;

  constructor() {
    this.garagePage = new GaragePage();
    this.winnersPage = new WinnersPage();
    this.garageStateManager = new GarageStateManager();
    this.winnersStateManager = new WinnersStateManager();

    const garageHandler = (): void => {
      this.loadGaragePage();
    };

    const winnersHandler = (): void => {
      this.loadWinnersPage();
    };

    const nav = createDomElement({
      tag: 'nav',
      className: 'nav',
      children: [
        {
          tag: 'button',
          className: 'nav__garage',
          textContent: 'Garage',
          onclick: garageHandler,
        },
        {
          tag: 'button',
          className: 'nav__winners',
          textContent: 'Winners',
          onclick: winnersHandler,
        },
      ],
    });

    this.pages = createDomElement({ tag: 'div', className: 'pages' });
    const wrapper = createDomElement({ tag: 'div', className: 'wrapper', children: [nav, this.pages] });
    document.body.append(wrapper);
  }

  private clearPageContent(): void {
    while (this.pages.firstChild) {
      this.pages.firstChild.remove();
    }
  }

  private renderPage(page: Page, stateManager: GarageStateManager | WinnersStateManager): void {
    this.clearPageContent();
    this.pages.append(page.getElement());
    page.renderPage(stateManager);
  }

  private async loadGaragePage(): Promise<void> {
    await this.garageStateManager.getCars();
    this.renderPage(this.garagePage, this.garageStateManager);
  }

  private async loadWinnersPage(): Promise<void> {
    await this.winnersStateManager.getWinners();
    this.renderPage(this.winnersPage, this.winnersStateManager);
  }

  public start(): void {
    this.loadGaragePage();
  }
}
