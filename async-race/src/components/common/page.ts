import View from 'components/common/view';
import Pagination from 'components/pagination';
import GarageStateManager from 'models/garage-state-manager';
import WinnersStateManager from 'models/winners-state-manager';

export default abstract class Page extends View {
  protected abstract pageName: string;

  protected abstract title: HTMLDivElement;

  protected abstract contentPageNumber: HTMLDivElement;

  protected abstract mainContent: HTMLDivElement;

  protected pagination: Pagination;

  constructor() {
    super();
    this.pagination = new Pagination();
  }

  protected updateTitle(totalCount: number): void {
    this.title.textContent = `${this.pageName} (${totalCount})`;
  }

  protected updateContentPageNumber(currentPage: number): void {
    this.contentPageNumber.textContent = `Page #${currentPage}`;
  }

  protected clearMainContent(): void {
    while (this.mainContent.firstChild) {
      this.mainContent.firstChild.remove();
    }
  }

  protected abstract renderMainContent(state: GarageStateManager | WinnersStateManager): void;

  public renderPage(state: GarageStateManager | WinnersStateManager): void {
    this.clearMainContent();
    this.updateTitle(state.totalCount);
    this.updateContentPageNumber(state.currentPage);
    this.renderMainContent(state);
  }

  public addPaginationHandler(prev: () => void, next: () => void): void {
    this.pagination.addHandlers(prev, next);
  }
}
