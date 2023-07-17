import Page from 'components/common/page';
import Car from 'models/car';
import GarageStateManager from 'models/garage-state-manager';
import createDomElement from 'utils/element-creator';

import './_garage.scss';

const PAGE_NAME = 'Garage';

export default class GaragePage extends Page {
  protected pageName: string;

  protected element: HTMLDivElement;

  protected title: HTMLDivElement;

  protected contentPageNumber: HTMLDivElement;

  protected mainContent: HTMLDivElement;

  constructor(state: GarageStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-garage' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-garage__content' });
    
    this.element.append(this.title, this.contentPageNumber, this.mainContent, this.pagination.getElement());

    const prevHandler = async (): Promise<void> => {
      await state.getPreviousCars();
      this.renderPage(state);
    };

    const nextHandler = async (): Promise<void> => {
      await state.getNextCars();
      this.renderPage(state);
    };

    this.addPaginationHandler(prevHandler, nextHandler);
  }

  private renderRacingTrack(car: Car): void {
    const carSelector = createDomElement({
      tag: 'div',
      className: 'car-selector',
      children: [
        { tag: 'div', className: 'car-selector__model', textContent: car.name },
        { tag: 'button', className: 'car-selector__select', textContent: 'Select' },
        { tag: 'button', className: 'car-selector__remove', textContent: 'Remove' },
      ],
    });
    const racingTrack = createDomElement({
      tag: 'div',
      className: 'racing-track',
      children: [
        {
          tag: 'div',
          className: 'car-control',
          children: [
            { tag: 'button', className: 'btn car-control__stop' },
            { tag: 'button', className: 'btn car-control__start' },
          ],
        },
        { tag: 'div', className: 'car car-icon', style: { backgroundColor: car.color } },
        { tag: 'div', className: 'flag' },
      ],
    });
    const garageBox = createDomElement({
      tag: 'div',
      className: 'garage-box',
      children: [carSelector, racingTrack],
    });
    this.mainContent.append(garageBox);
  }

  public renderMainContent(state: GarageStateManager): void {
    state.cars.forEach((car) => this.renderRacingTrack(car));
  }
}
