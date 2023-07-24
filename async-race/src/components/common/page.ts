import View from 'components/common/view';
import Pagination from 'components/pagination';
import GarageStateManager from 'models/garage-state-manager';
import WinnersStateManager from 'models/winners-state-manager';

export default abstract class Page extends View {
  protected abstract pageName: string;

  protected abstract title: HTMLDivElement;

  protected abstract contentPageNumber: HTMLDivElement;

  protected abstract mainContent: HTMLDivElement;

  protected abstract state: GarageStateManager | WinnersStateManager;

  protected pagination: Pagination;

  protected isPageLoaded = false;

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

  protected abstract renderMainContent(): void;

  public renderPage(reload = false): void {
    if (this.isPageLoaded && !reload) {
      return;
    }

    this.clearMainContent();
    this.updateTitle(this.state.totalCount);
    this.updateContentPageNumber(this.state.currentPage);
    this.renderMainContent();
    this.pagination.update(this.state.totalCount, this.state.currentPage, this.state.elementsPerOnePage);
    this.isPageLoaded = true;
  }

  public addPaginationHandler(prev: () => void, next: () => void): void {
    this.pagination.addHandlers(prev, next);
  }
}
