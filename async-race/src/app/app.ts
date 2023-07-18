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
    this.garageStateManager = new GarageStateManager();
    this.winnersStateManager = new WinnersStateManager();
    this.garagePage = new GaragePage(this.garageStateManager);
    this.winnersPage = new WinnersPage(this.winnersStateManager);

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
          className: 'btn nav__garage',
          textContent: 'Garage',
          onclick: garageHandler,
        },
        {
          tag: 'button',
          className: 'btn nav__winners',
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

  private mountPage(page: Page): void {
    this.clearPageContent();
    this.pages.append(page.getElement());
  }

  private async loadGaragePage(): Promise<void> {
    await this.garageStateManager.getCars();
    this.mountPage(this.garagePage);
    this.garagePage.renderPage();
  }

  private async loadWinnersPage(): Promise<void> {
    await this.winnersStateManager.getWinners();
    this.mountPage(this.winnersPage);
    this.winnersPage.renderPage();
  }

  public start(): void {
    this.loadGaragePage();
  }
}
