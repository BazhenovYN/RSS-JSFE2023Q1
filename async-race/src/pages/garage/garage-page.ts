import { CAR_STATUS, MILLISECONDS_IN_SECOND, emptyString } from 'app/consts';
import Page from 'components/common/page';
import ControlPanel from 'components/control-panel';
import { showError } from 'components/error-snackbar';
import Car from 'models/car';
import GarageStateManager from 'models/garage-state-manager';
import createDomElement from 'utils/element-creator';

import type { ICarProps } from 'types';

import './_garage.scss';

const PAGE_NAME = 'Garage';
const ERROR_MESSAGE_NO_WINNERS = 'Oops... I guess there are no winners';
const FRAMES_PER_SECOND = 60;

const getTrackLength = (carView: HTMLDivElement): number => {
  const totalWidth = carView.parentElement?.clientWidth || 0;
  return totalWidth - carView.offsetWidth - carView.offsetLeft;
};

const animatePosition = (carView: HTMLDivElement, car: Car): void => {
  const endX = getTrackLength(carView);
  const framesCount = (car.raceTime / MILLISECONDS_IN_SECOND) * FRAMES_PER_SECOND;
  const dX = endX / framesCount;
  let currentX = 0;

  const step = (): void => {
    if (car.status === CAR_STATUS.started) {
      currentX = currentX + dX < endX ? currentX + dX : endX;
      carView.style.setProperty('transform', `translateX(${currentX}px)`);
      if (currentX < endX) {
        requestAnimationFrame(step);
      }
    }
  };

  step();
};

const startCar = (carView: HTMLDivElement, car: Car): Promise<Car> =>
  new Promise((resolve, reject) => {
    car
      .startEngine()
      .then(() => {
        animatePosition(carView, car);
        car
          .driveEngine()
          .then(() => {
            resolve(car);
          })
          .catch(() => {
            carView.classList.add('broken');
            reject();
          });
      })
      .catch((error) => showError(error));
  });

const stopCar = async (carView: HTMLDivElement, car: Car): Promise<void> => {
  try {
    await car.stopEngine();
    carView.style.setProperty('transform', emptyString);
  } catch (error) {
    showError(error)
  }
};

export default class GaragePage extends Page {
  protected pageName: string;

  protected element: HTMLDivElement;

  protected title: HTMLDivElement;

  protected contentPageNumber: HTMLDivElement;

  protected mainContent: HTMLDivElement;

  private controlPanel: ControlPanel;

  private selectedCarId: number | null = null;

  private startingCars: (() => Promise<Car>)[] = [];

  private stoppingCars: (() => void)[] = [];

  private message: HTMLDivElement;

  private startButtons: HTMLButtonElement[] = [];

  private stopButtons: HTMLButtonElement[] = [];

  constructor(protected state: GarageStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-garage' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-garage__content' });

    this.controlPanel = this.createControlPanel();
    this.message = createDomElement({ tag: 'div', className: 'message' });

    this.element.append(
      this.controlPanel.getElement(),
      this.title,
      this.contentPageNumber,
      this.mainContent,
      this.pagination.getElement(),
      this.message,
    );

    this.configurePagination();
  }

  private async startRaceHandler(): Promise<void> {
    if (!this.startingCars.length) return;

    this.startButtons.forEach((btn) => btn.setAttribute('disabled', emptyString));
    this.stopButtons.forEach((btn) => btn.setAttribute('disabled', emptyString));

    const startTime = Date.now();
    const promises = this.startingCars.map((func) => func());
    try {
      const winner = await Promise.any(promises);
      await winner.saveResult(startTime);
      this.showWinner(winner);
    } catch {
      this.showNoWinners();
    }
  }

  private createControlPanel(): ControlPanel {
    const onCreate = async (param: ICarProps): Promise<void> => {
      await this.state.createCar(param);
      this.renderPage(true);
    };
    const onUpdate = async (param: ICarProps): Promise<void> => {
      if (this.selectedCarId) {
        await this.state.updateCar(this.selectedCarId, param);
        this.selectedCarId = null;
        this.renderPage(true);
      }
    };
    const onGenerate = async (): Promise<void> => {
      await this.state.generateRandomCars();
      this.renderPage(true);
    };

    const onReset = async (): Promise<void> => {
      if (!this.stoppingCars.length) return;

      this.startButtons.forEach((btn) => btn.removeAttribute('disabled'));
      this.stopButtons.forEach((btn) => btn.setAttribute('disabled', emptyString));
      this.message.classList.remove('show');
      this.stoppingCars.forEach((func) => func());
    };

    const controlPanel = new ControlPanel({
      onCreate,
      onUpdate,
      onGenerate,
      onRace: this.startRaceHandler.bind(this),
      onReset,
    });
    return controlPanel;
  }

  private configurePagination(): void {
    const prevHandler = async (): Promise<void> => {
      await this.state.getPreviousCars();
      this.renderPage(true);
    };

    const nextHandler = async (): Promise<void> => {
      await this.state.getNextCars();
      this.renderPage(true);
    };

    this.addPaginationHandler(prevHandler, nextHandler);
  }

  private renderRacingTrack(car: Car): HTMLDivElement {
    const carView = createDomElement({ tag: 'div', className: 'car car-icon', style: { backgroundColor: car.color } });

    const btnStartCar = createDomElement({ tag: 'button', className: 'btn car-control__start' });
    const btnStopCar = createDomElement({ tag: 'button', className: 'btn car-control__stop' });

    btnStartCar.addEventListener('click', () => {
      btnStartCar.setAttribute('disabled', emptyString);
      btnStopCar.removeAttribute('disabled');
      startCar(carView, car).catch(() => {});
    });

    btnStopCar.addEventListener('click', () => {
      btnStartCar.removeAttribute('disabled');
      btnStopCar.setAttribute('disabled', emptyString);
      stopCar(carView, car);
    });
    btnStopCar.setAttribute('disabled', emptyString);

    this.startingCars.push(() => startCar(carView, car));
    this.stoppingCars.push(() => stopCar(carView, car));

    this.startButtons.push(btnStartCar);
    this.stopButtons.push(btnStopCar);

    return createDomElement({
      tag: 'div',
      className: 'racing-track',
      children: [
        {
          tag: 'div',
          className: 'car-control',
          children: [btnStopCar, btnStartCar],
        },
        carView,
        { tag: 'div', className: 'flag' },
      ],
    });
  }

  private renderGarageBox(car: Car): void {
    const selectHandler = (): void => {
      this.selectedCarId = car.id;
      this.controlPanel.initUpdater({ carName: car.name, carColor: car.color });
    };
    const removeHandler = async (): Promise<void> => {
      await this.state.deleteCar(car.id);
      this.renderPage(true);
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
    const racingTrack = this.renderRacingTrack(car);
    const garageBox = createDomElement({ tag: 'div', className: 'garage-box', children: [carSelector, racingTrack] });
    this.mainContent.append(garageBox);
  }

  protected clearMainContent(): void {
    super.clearMainContent();

    this.startingCars = [];
    this.startButtons = [];
    this.stoppingCars = [];
    this.stopButtons = [];
    this.controlPanel.resetPanel();
    this.message.classList.remove('show');
  }

  protected renderMainContent(): void {
    this.state.cars.forEach((car) => this.renderGarageBox(car));
  }

  private showWinner(car: Car): void {
    this.message.textContent = `${car.name} went first (${car.totalTime} s)`;
    this.message.classList.add('show');
  }

  private showNoWinners(): void {
    this.message.textContent = ERROR_MESSAGE_NO_WINNERS;
    this.message.classList.add('show');
  }
}
