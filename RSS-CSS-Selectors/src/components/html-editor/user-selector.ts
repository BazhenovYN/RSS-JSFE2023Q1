import { emitter, events } from 'components/common/event-emmitter';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';
import InputView from 'utils/input-element-creator';

export default class UserSelector extends View {
  private input: InputView;

  private answer = '';

  private isTimerStart = false;;

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
    emitter.subscribe(events.helpClick, this.getHelp.bind(this, 0, false));
  }

  private configureView(): void {
    const enterSelectorHandler = (): void => {
      emitter.emit(events.selectorEnter, this.input.getValue());
    };

    const keyEnterSelectorHandler = (event: KeyboardEvent): void => {
      if (event.code === 'Enter') {
        emitter.emit(events.selectorEnter, this.input.getValue());
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

  public getHelp(index: number, timer: boolean): void {
    if (this.isTimerStart && !timer) {
      return; // answer not yet printed
    }

    if (index <= this.answer.length) {
      this.input.setValue(this.answer.slice(0, index));
    }
    if (index + 1 <= this.answer.length) {
      this.isTimerStart = true;
      setTimeout(() => this.getHelp(index + 1, true), 300);
    } else {
      this.isTimerStart = false;
    }
  }
}
