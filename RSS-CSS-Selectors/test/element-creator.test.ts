/* eslint-disable max-lines-per-function */
import ElementCreator from 'utils/element-creator';

let block: ElementCreator;
let wrapper: HTMLElement;

describe('element-creator', () => {
  beforeEach(() => {
    block = new ElementCreator({ tag: 'div', classes: ['default'] });
    wrapper = document.createElement('div');
    wrapper.append(block.getElement());
  });

  it('should create new html element', () => {
    const child = wrapper.firstChild;
    expect(child).not.toBe(null);
    if (child) {
      expect(child.nodeName).toBe('DIV');
    }
  });

  it('should set id', () => {
    block.setId('some');
    const child = wrapper.firstChild;
    expect(child).not.toBe(null);
    if (child instanceof HTMLElement) {
      expect(child.id).toBe('some');
    }
  });

  it('should set css classes', () => {
    const classes = ['some-class', 'another-class'];
    block.setCssClasses(classes);

    const child = wrapper.firstChild;
    expect(child).not.toBe(null);
    if (child instanceof HTMLElement) {
      expect([...child.classList]).toEqual(expect.arrayContaining(classes));
    }
  });

  it('should remove css class', () => {
    block.removeCssClasses(['default']);
    const child = wrapper.firstChild;
    expect(child).not.toBe(null);
    if (child instanceof HTMLElement) {
      expect([...child.classList]).not.toContain('default');
    }
  });

  it('should set text content', () => {
    block.setTextContent('content');
    const child = wrapper.firstChild;
    expect(child).not.toBe(null);
    if (child instanceof HTMLElement) {
      expect(child.textContent).toBe('content');
    }
  });

  it('should return HTML-element', () => {
    const element = block.getElement();
    const child = wrapper.firstChild;
    expect(element).toBe(child);
  });

  it('should add "click" event listener', () => {
    const callback = jest.fn();
    block.setEventListener('click', callback);

    const event = new Event('click');
    block.getElement().dispatchEvent(event);

    expect(callback).toBeCalledTimes(1);
  });

  it('should add "mouseenter" event listener', () => {
    const callback = jest.fn();
    block.setEventListener('mouseenter', callback);

    const event = new Event('mouseenter');
    block.getElement().dispatchEvent(event);

    expect(callback).toBeCalledTimes(1);
  });

  it('should add "mouseleave" event listener', () => {
    const callback = jest.fn();
    block.setEventListener('mouseleave', callback);

    const event = new Event('mouseleave');
    block.getElement().dispatchEvent(event);

    expect(callback).toBeCalledTimes(1);
  });
});
