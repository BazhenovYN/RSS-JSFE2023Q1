import Page from 'components/common/page';
import ControlPanel from 'components/control-panel';
import Car from 'models/car';
import GarageStateManager from 'models/garage-state-manager';
import createDomElement from 'utils/element-creator';

import type { ICarProps } from 'types';

import './_garage.scss';

const PAGE_NAME = 'Garage';

const getTrackLength = (carView: HTMLDivElement): number => {
  const totalWidth = carView.parentElement?.clientWidth || 0;
  return totalWidth - carView.offsetWidth - carView.offsetLeft;
};

const animatePosition = (carView: HTMLDivElement, car: Car): void => {
  const endX = getTrackLength(carView);
  const framesCount = (car.raceTime / 1000) * 60;
  const dX = endX / framesCount;
  let currentX = 0;

  const step = (): void => {
    if (car.status === 'started') {
      currentX = currentX + dX < endX ? currentX + dX : endX;
      carView.style.setProperty('transform', `translateX(${currentX}px)`);
      if (currentX < endX) {
        requestAnimationFrame(step);
      }
    } else if (car.status === 'broken') {
      carView.classList.add('broken');
    }
  };

  step();
};

const startCar = (carView: HTMLDivElement, car: Car): Promise<Car> =>
  new Promise((resolve, reject) => {
    car.startEngine().then(() => {
      car
        .driveEngine()
        .then(() => {
          resolve(car);
        })
        .catch(reject);
      animatePosition(carView, car);
    });
  });

const stopCar = async (carView: HTMLDivElement, car: Car): Promise<void> => {
  await car.stopEngine();
  carView.style.setProperty('transform', '');
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

  private winner: HTMLDivElement;

  constructor(protected state: GarageStateManager) {
    super();
    this.pageName = PAGE_NAME;
    this.element = createDomElement({ tag: 'div', className: 'page page-garage' });
    this.title = createDomElement({ tag: 'div', className: 'page__title' });
    this.contentPageNumber = createDomElement({ tag: 'div', className: 'page__content-page-number' });
    this.mainContent = createDomElement({ tag: 'div', className: 'page-garage__content' });

    this.controlPanel = this.createControlPanel();
    this.winner = createDomElement({ tag: 'div', className: 'winner' });

    this.element.append(
      this.controlPanel.getElement(),
      this.title,
      this.contentPageNumber,
      this.mainContent,
      this.pagination.getElement(),
      this.winner,
    );

    this.configurePagination();
  }

  private async startRaceHandler(): Promise<void> {
    const promises = this.startingCars.map(func => func());
    const raceResults = await Promise.allSettled(promises);
    const winner = raceResults
      .reduce<Car[]>((cars, result) => {
        if (result.status === 'fulfilled' && result.value.status === 'finished') {
          cars.push(result.value);
        }
        return cars;
      }, [])
      .sort((carA, carB) => carA.finishTime - carB.finishTime)[0];
    this.showWinner(winner);
  }

  private createControlPanel(): ControlPanel {
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

    const onReset = async (): Promise<void> => {
      this.winner.classList.remove('show');
      this.stoppingCars.forEach(func => func());
    }

    const controlPanel = new ControlPanel({
      onCreate,
      onUpdate,
      onGenerate,
      onRace: this.startRaceHandler.bind(this),
      onReset,
      createButtonAlias: 'Create',
      updateButtonAlias: 'Update',
    });
    return controlPanel;
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

  private renderRacingTrack(car: Car): HTMLDivElement {
    const carView = createDomElement({ tag: 'div', className: 'car car-icon', style: { backgroundColor: car.color } });

    const btnStartCar = createDomElement({ tag: 'button', className: 'btn car-control__start' });
    btnStartCar.addEventListener('click', () => {
      startCar(carView, car);
    });

    this.startingCars.push(() => startCar(carView, car));
    this.stoppingCars.push(() => stopCar(carView, car));

    const btnStopCar = createDomElement({ tag: 'button', className: 'btn car-control__stop' });
    btnStopCar.addEventListener('click', () => {
      stopCar(carView, car);
    });

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
    const racingTrack = this.renderRacingTrack(car);
    const garageBox = createDomElement({ tag: 'div', className: 'garage-box', children: [carSelector, racingTrack] });
    this.mainContent.append(garageBox);
  }

  protected renderMainContent(): void {
    this.startingCars = [];
    this.state.cars.forEach((car) => this.renderGarageBox(car));
  }

  private showWinner(car: Car): void {
    this.winner.textContent = `${car.name} went first (${car.raceTime / 1000} s)`;
    this.winner.classList.add('show');
  }
}
