import Page from 'components/common/page';
import WinnersStateManager from 'models/winners-state-manager';
import createDomElement from 'utils/element-creator';

import './_winners.scss';

const PAGE_NAME = 'Winners';
const ORDER = {
  asc: 'ASC',
  desk: 'DESC',
}
const TABLE_ORDERING_FIELDS = {
  wins: 'wins',
  time: 'time',
}

const toggleOrderDirection = (value: string):string => value === ORDER.asc ? ORDER.desk : ORDER.asc

export default class WinnersPage extends Page {
  protected pageName: string;

  protected element: HTMLDivElement;

  protected title: HTMLDivElement;

  protected contentPageNumber: HTMLDivElement;

  protected mainContent: HTMLDivElement;

  private orderField = '';

  private orderDirection = '';

  constructor(protected state: WinnersStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-winners' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-winners__content' });

    this.element.append(this.title, this.contentPageNumber, this.mainContent, this.pagination.getElement());

    const prevHandler = async (): Promise<void> => {
      await this.state.getPreviousWinners();
      this.renderPage();
    };

    const nextHandler = async (): Promise<void> => {
      await this.state.getNextWinners();
      this.renderPage();
    };

    this.addPaginationHandler(prevHandler, nextHandler);
  }

  private setDataOrder = async (): Promise<void> => {
    this.orderDirection = toggleOrderDirection(this.orderDirection);
    await this.state.getWinners(null, [
      { key: '_sort', value: this.orderField },
      { key: '_order', value: this.orderDirection },
    ]);
    this.renderPage();
  }

  private getTHead = (): HTMLTableSectionElement => {
    const cellWins = createDomElement({ tag: 'th', textContent: 'Wins', className: 'order-button' });
    cellWins.addEventListener('click', async (): Promise<void> => {
      this.orderField = TABLE_ORDERING_FIELDS.wins;
      await this.setDataOrder();
    });

    const cellTime = createDomElement({ tag: 'th', textContent: 'Best time (sec)', className: 'order-button' });
    cellTime.addEventListener('click', async (): Promise<void> => {
      this.orderField = TABLE_ORDERING_FIELDS.time;
      await this.setDataOrder();
    });
    
    if (this.orderField === TABLE_ORDERING_FIELDS.wins) {
      cellWins.setAttribute('order', this.orderDirection.toLowerCase());
    } else if (this.orderField === TABLE_ORDERING_FIELDS.time) {
      cellTime.setAttribute('order', this.orderDirection.toLowerCase());
    }

    const head = createDomElement({
      tag: 'thead',
      children: [
        {
          tag: 'tr',
          children: [
            { tag: 'th', textContent: 'Number' },
            { tag: 'th', textContent: 'Car' },
            { tag: 'th', textContent: 'Name' },
            cellWins,
            cellTime,
          ],
        },
      ],
    });
    return head;
  };

  private renderTableOfWinners(): void {
    const head = this.getTHead();
    const body = createDomElement({ tag: 'tbody' });
    let count = (this.state.currentPage - 1) * this.state.elementsPerOnePage;
    this.state.winners.forEach((winner) => {
      const row = createDomElement({
        tag: 'tr',
        children: [
          { tag: 'td', textContent: `${(count += 1)}` },
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

  protected renderMainContent(): void {
    this.renderTableOfWinners();
  }
}
