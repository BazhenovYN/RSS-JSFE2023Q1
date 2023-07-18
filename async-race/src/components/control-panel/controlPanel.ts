import View from 'components/common/view';
import createDomElement from 'utils/element-creator';
import type { ICarEditor, IControlPanel } from 'types';

import CarEditor from './car-editor';

import './_control-panel.scss';

export default class ControlPanel extends View {
  protected element: HTMLDivElement;

  private updater: CarEditor;

  constructor({ onCreate, onUpdate, onGenerate, createButtonAlias, updateButtonAlias }: IControlPanel) {
    super();
    const creator = new CarEditor({ onSubmit: onCreate, submitButtonAlias: createButtonAlias });
    this.updater = new CarEditor({ onSubmit: onUpdate, submitButtonAlias: updateButtonAlias });
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
            { 
              tag: 'button', 
              className: 'btn group-commands__race',
              textContent: 'Race',
            },
            { 
              tag: 'button', 
              className: 'btn group-commands__reset',
              textContent: 'Reset',
            },
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

  public configureUpdater({ carName, carColor }: ICarEditor): void {
    this.updater.update({ carName, carColor });
  }
}
