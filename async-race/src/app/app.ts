import createDomElement from 'utils/element-creator';
import carSvg from 'assets/svg/car.svg'

export default class App {
  constructor() {   
    const block = createDomElement({ tag: 'div', textContent: 'block2' });
    // const car = createDomElement({tag: 'object', type: 'image/svg+xml', data: carSvg, className: 'car'});
    const car = createDomElement({ tag: 'span', className: 'icon' });
    
    const wrapper = createDomElement({
      tag: 'div',
      textContent: 'DIV',
      className: 'wrapper red',
      onclick: () => console.log('Hello'),
      children: ['hello', { tag: 'i', textContent: 'great' }, 'world', block, car],
    });
    
    // const inp = createDomElement({ tag: 'input', value: 'Email', className: 'user-input' });
    document.body.append(wrapper);
  }
  // public start(): void {}
}
