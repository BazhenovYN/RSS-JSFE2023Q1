import Page from 'components/common/page';
import Winner from 'models/winner';
import WinnersStateManager from 'models/winners-state-manager';
import createDomElement from 'utils/element-creator';

import './_winners.scss';

const PAGE_NAME = 'Winners';

export default class WinnersPage extends Page {
  protected pageName: string;

  protected element: HTMLDivElement;

  protected title: HTMLDivElement;

  protected contentPageNumber: HTMLDivElement;

  protected mainContent: HTMLDivElement;

  constructor(state: WinnersStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-winners' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-winners__content' });

    this.element.append(this.title, this.contentPageNumber, this.mainContent, this.pagination.getElement());

    const prevHandler = async (): Promise<void> => {
      await state.getPreviousWinners();
      this.renderPage(state);
    };

    const nextHandler = async (): Promise<void> => {
      await state.getNextWinners();
      this.renderPage(state);
    };

    this.addPaginationHandler(prevHandler, nextHandler);
  }

  private renderTableOfWinners(winners: Winner[]): void {
    const head = createDomElement({
      tag: 'thead',
      children: [
        {
          tag: 'tr',
          children: [
            { tag: 'th', textContent: 'Number' },
            { tag: 'th', textContent: 'Car' },
            { tag: 'th', textContent: 'Name' },
            { tag: 'th', textContent: 'Wins' },
            { tag: 'th', textContent: 'Best time (sec)' },
          ],
        },
      ],
    });
    const body = createDomElement({ tag: 'tbody' });
    winners.forEach((winner, index) => {
      const row = createDomElement({
        tag: 'tr',
        children: [
          { tag: 'td', textContent: `${index + 1}` },
          {
            tag: 'td',
            children: [{ tag: 'div', className: 'car car-icon', style: { backgroundColor: winner.color } }],
          },
          { tag: 'td', textContent: `${winner.name}` },
          { tag: 'td', textContent: `${winner.wins}` },
          { tag: 'td', textContent: `${winner.time}` },
        ],
      });
      body.append(row);
    });
    const table = createDomElement({
      tag: 'table',
      className: 'winners-table',
      children: [head, body],
    });
    this.mainContent.append(table);
  }

  public renderMainContent(state: WinnersStateManager): void {
    this.renderTableOfWinners(state.winners);
  }
}
