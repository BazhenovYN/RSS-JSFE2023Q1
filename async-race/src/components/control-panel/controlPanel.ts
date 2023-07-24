import View from 'components/common/view';
import createDomElement from 'utils/element-creator';
import type { ICarEditor, IControlPanel } from 'types';

import CarEditor from './car-editor';

import './_control-panel.scss';

export default class ControlPanel extends View {
  protected element: HTMLDivElement;

  private updater: CarEditor;

  constructor({ onCreate, onUpdate, onGenerate, onRace, onReset, createButtonAlias, updateButtonAlias }: IControlPanel) {
    super();
    const creator = new CarEditor({ onSubmit: onCreate, submitButtonAlias: createButtonAlias });
    this.updater = new CarEditor({ onSubmit: onUpdate, submitButtonAlias: updateButtonAlias, isUpdater: true });

    const raceButton = createDomElement({ tag: 'button', className: 'btn group-commands__race', textContent: 'Race' });
    const resetButton = createDomElement({ tag: 'button', className: 'btn group-commands__reset', textContent: 'Reset' });
    raceButton.addEventListener('click', () => {
      raceButton.setAttribute('disabled', '');
      onRace();
    });
    resetButton.addEventListener('click', () => {
      raceButton.removeAttribute('disabled');
      onReset();
    });

    this.element = createDomElement({
      tag: 'div',
      className: 'control-panel',
      children: [
        creator.getElement(), 
        this.updater.getElement(),
        {
          tag: 'div',
          className: 'group-commands',
          children: [
            raceButton,
            resetButton,
            { 
              tag: 'button', 
              className: 'btn group-commands__generate-cars',
              textContent: 'Generate cars',
              onclick: onGenerate,
            }
          ]
        }
      ],
    });
  }

  public initUpdater({ carName, carColor }: ICarEditor): void {
    this.updater.update({ carName, carColor });
    this.updater.enableAllElements();
  }
}
