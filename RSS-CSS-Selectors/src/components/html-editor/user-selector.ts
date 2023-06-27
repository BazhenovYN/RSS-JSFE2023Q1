import emitter from 'components/common/event-emmitter';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';
import InputView from 'utils/input-element-creator';

export default class UserSelector extends View {
  private input: InputView;

  private answer = '';

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
    emitter.subscribe('event:help-click', this.getHelp.bind(this, 0));
  }

  private configureView(): void {
    const enterSelectorHandler = (): void => {
      emitter.emit('event:selector-enter', this.input.getValue());
    };

    const keyEnterSelectorHandler = (event: KeyboardEvent): void => {
      if (event.code === 'Enter') {
        emitter.emit('event:selector-enter', this.input.getValue());
      }
    };

    this.input.setKeydownListener(keyEnterSelectorHandler);

    const enterButton = new ElementCreator({
      tag: 'button',
      classes: ['selector__enter'],
      textContent: 'Enter',
      callback: enterSelectorHandler,
    });

    this.viewElement.addInnerElement(this.input);
    this.viewElement.addInnerElement(enterButton);
  }

  public clearInput(): void {
    this.input.setValue('');
  }

  public setAnswer(answer: string): void {
    this.answer = answer;
  }

  public getHelp(index: number): void {
    if (index <= this.answer.length) {
      this.input.setValue(this.answer.slice(0, index));
    }
    if (index + 1 <= this.answer.length) {
      setTimeout(() => this.getHelp(index + 1), 300);
    }
  }
}
