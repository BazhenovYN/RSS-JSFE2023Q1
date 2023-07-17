import View from 'components/common/view';
import GarageStateManager from 'models/garage-state-manager';
import WinnersStateManager from 'models/winners-state-manager';

export default abstract class Page extends View {
  protected abstract pageName: string;

  protected abstract title: HTMLDivElement;

  protected abstract contentPageNumber: HTMLDivElement;

  protected abstract mainContent: HTMLDivElement;

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

  public abstract renderPage(state: GarageStateManager | WinnersStateManager): void;
}
