import { emptyString } from 'app/consts';
import View from 'components/common/view';
import createDomElement from 'utils/element-creator';
import type { ICarEditor, IControlPanel } from 'types';

import CarEditor from './car-editor';

import './_control-panel.scss';

export default class ControlPanel extends View {
  protected element: HTMLDivElement;

  private creator: CarEditor;

  private updater: CarEditor;

  private raceButton: HTMLButtonElement;

  private resetButton: HTMLButtonElement;

  constructor({ onCreate, onUpdate, onGenerate, onRace, onReset }: IControlPanel) {
    super();
    this.creator = new CarEditor({ onSubmit: onCreate, submitButtonAlias: 'Create' });
    this.updater = new CarEditor({ onSubmit: onUpdate, submitButtonAlias: 'Update', isUpdater: true });

    this.raceButton = createDomElement({ tag: 'button', className: 'btn commands__race', textContent: 'Race' });
    this.resetButton = createDomElement({ tag: 'button', className: 'btn commands__reset', textContent: 'Reset' });
    this.raceButton.addEventListener('click', () => {
      this.raceButton.setAttribute('disabled', emptyString);
      onRace();
    });
    this.resetButton.addEventListener('click', () => {
      this.raceButton.removeAttribute('disabled');
      onReset();
    });

    this.element = createDomElement({
      tag: 'div',
      className: 'control-panel',
      children: [
        this.creator.getElement(),
        this.updater.getElement(),
        {
          tag: 'div',
          className: 'commands',
          children: [
            this.raceButton,
            this.resetButton,
            {
              tag: 'button',
              className: 'btn commands__generate-cars',
              textContent: 'Generate cars',
              onclick: onGenerate,
            },
          ],
        },
      ],
    });
  }

  public initUpdater({ carName, carColor }: ICarEditor): void {
    this.updater.update({ carName, carColor });
  }

  public resetPanel(): void {
    this.raceButton.removeAttribute('disabled');
  }
}
