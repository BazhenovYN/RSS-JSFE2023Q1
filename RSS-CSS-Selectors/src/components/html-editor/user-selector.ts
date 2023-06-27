import emitter from 'components/common/event-emmitter';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';
import InputView from 'utils/input-element-creator';

export default class UserSelector extends View {
  private input: InputView;

  constructor() {
    super({ tag: 'div', classes: ['selector'] });
    this.input = new InputView({
      classes: ['selector__input'],
      attributes: {
        placeholder: 'Type in a CSS selector',
        maxlength: '50',
      },
    });

    this.configureView();
    
  }

  private configureView(): void {
    const EnterSelectorHandler = (): void => {
      emitter.emit('event:selector-enter', this.input.getValue());
    };

    const enterButton = new ElementCreator({
      tag: 'button',
      classes: ['selector__enter'],
      textContent: 'Enter',
      callback: EnterSelectorHandler,
    });

    this.viewElement.addInnerElement(this.input);
    this.viewElement.addInnerElement(enterButton);
  }

  public clearInput(): void {
    this.input.setValue('');
  }
}
