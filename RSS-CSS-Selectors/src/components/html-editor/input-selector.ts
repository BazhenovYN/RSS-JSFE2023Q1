import ElementCreator from 'utils/element-creator';

export default class InputSelector extends ElementCreator {
  constructor() {
    super({ tag: 'div', classes: ['selector'] });

    const input = new ElementCreator({ tag: 'input', classes: ['selector__input'] });
    input.setAttributes({
      placeholder: 'Type in a CSS selector',
      maxlength: '50',
    });

    const enterButton = new ElementCreator({
      tag: 'button',
      classes: ['selector__enter'],
      textContent: 'Enter',
    });

    this.addInnerElement(input);
    this.addInnerElement(enterButton);
  }
}
