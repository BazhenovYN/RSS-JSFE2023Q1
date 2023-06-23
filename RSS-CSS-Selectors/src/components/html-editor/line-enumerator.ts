import ElementCreator from 'utils/element-creator';

const DEFAULT_ROW_COUNT = 15;

export default class LineEnumerator extends ElementCreator {
  constructor(count = DEFAULT_ROW_COUNT) {
    super({ tag: 'div', classes: ['hljs', 'line-numbers'] });
    for (let i = 1; i <= count; i += 1) {
      const line = new ElementCreator({
        tag: 'div',
        classes: ['line'],
        textContent: String(i),
      });
      this.addInnerElement(line);
    }
  }
}
