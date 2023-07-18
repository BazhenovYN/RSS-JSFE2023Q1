import Page from 'components/common/page';
import ControlPanel from 'components/control-panel';
import Car from 'models/car';
import GarageStateManager from 'models/garage-state-manager';
import createDomElement from 'utils/element-creator';

import type { ICarProps } from 'types';

import './_garage.scss';

const PAGE_NAME = 'Garage';

export default class GaragePage extends Page {
  protected pageName: string;

  protected element: HTMLDivElement;

  protected title: HTMLDivElement;

  protected contentPageNumber: HTMLDivElement;

  protected mainContent: HTMLDivElement;

  private controlPanel: ControlPanel;

  private selectedCarId: number | null = null;

  constructor(protected state: GarageStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-garage' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-garage__content' });

    const onCreate = async (param: ICarProps): Promise<void> => {
      await this.state.createCar(param);
      this.renderPage();
    };
    const onUpdate = async (param: ICarProps): Promise<void> => {
      if (this.selectedCarId) {
        await this.state.updateCar(this.selectedCarId, param);
        this.selectedCarId = null;
        this.renderPage();
      }
    };
    const onGenerate = async (): Promise<void> => {
      await this.state.generateRandomCars();
      this.renderPage();
    };
    const createButtonAlias = 'Create';
    const updateButtonAlias = 'Update';
    this.controlPanel = new ControlPanel({ onCreate, onUpdate, onGenerate, createButtonAlias, updateButtonAlias });

    this.element.append(
      this.controlPanel.getElement(),
      this.title,
      this.contentPageNumber,
      this.mainContent,
      this.pagination.getElement(),
    );

    this.configurePagination();
  }

  private configurePagination(): void {
    const prevHandler = async (): Promise<void> => {
      await this.state.getPreviousCars();
      this.renderPage();
    };

    const nextHandler = async (): Promise<void> => {
      await this.state.getNextCars();
      this.renderPage();
    };

    this.addPaginationHandler(prevHandler, nextHandler);
  }

  private renderRacingTrack(car: Car): void {
    const selectHandler = (): void => {
      this.selectedCarId = car.id;
      this.controlPanel.configureUpdater({ carName: car.name, carColor: car.color });
    };
    const removeHandler = async (): Promise<void> => {
      await this.state.deleteCar(car.id);
      this.renderPage();
    };
    const carSelector = createDomElement({
      tag: 'div',
      className: 'car-selector',
      children: [
        { tag: 'button', className: 'btn car-selector__select', textContent: 'Select', onclick: selectHandler },
        { tag: 'button', className: 'btn car-selector__remove', textContent: 'Remove', onclick: removeHandler },
        { tag: 'div', className: 'car-selector__model', textContent: car.name },
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
    const garageBox = createDomElement({ tag: 'div', className: 'garage-box', children: [carSelector, racingTrack] });
    this.mainContent.append(garageBox);
  }

  public renderMainContent(): void {
    this.state.cars.forEach((car) => this.renderRacingTrack(car));
  }
}
