import { defaultCarColor } from 'app/consts';
import View from 'components/common/view';
import createDomElement from 'utils/element-creator';
import type { Color, ICarEditor } from 'types';

const DEFAULT_COMMAND_NAME = 'OK';

export default class CarEditor extends View {
  protected element: HTMLFormElement;

  private name: HTMLInputElement;

  private color: HTMLInputElement;

  public submit: HTMLInputElement;

  private isUpdater: boolean;

  constructor({ onSubmit, submitButtonAlias, isUpdater = false }: ICarEditor) {
    super();
    this.name = createDomElement({ tag: 'input', type: 'text', name: 'name', className: 'car-editor__name' });
    this.name.setAttribute('required', '');
    this.color = createDomElement({
      tag: 'input',
      type: 'color',
      value: defaultCarColor,
      name: 'color',
      className: 'car-editor__color',
    });
    this.submit = createDomElement({
      tag: 'input',
      type: 'submit',
      value: submitButtonAlias || DEFAULT_COMMAND_NAME,
      className: 'btn car-editor__submit',
    });
    this.isUpdater = isUpdater;
    this.element = createDomElement({
      tag: 'form',
      className: 'car-editor',
      children: [this.name, this.color, this.submit],
    });
    this.element.onsubmit = (event): void => {
      event.preventDefault();
      const data = new FormData(this.element);
      const name = data.get('name') as string;
      const color = data.get('color') as Color;
      if (typeof onSubmit === 'function') {
        onSubmit({ name, color });
      }
      this.update({});
      if (this.isUpdater) {
        this.disableAllElements();
      }
    };
    if (this.isUpdater) {
      this.disableAllElements();
    }
  }

  private disableAllElements(): void {
    this.name.setAttribute('disabled', '');
    this.color.setAttribute('disabled', '');
    this.submit.setAttribute('disabled', '');
  }

  private enableAllElements(): void {
    this.name.removeAttribute('disabled');
    this.color.removeAttribute('disabled');
    this.submit.removeAttribute('disabled');
  }

  public update({ carName, carColor }: ICarEditor): void {
    this.name.value = carName || '';
    this.color.value = carColor || defaultCarColor;
    this.enableAllElements();
  }
}
