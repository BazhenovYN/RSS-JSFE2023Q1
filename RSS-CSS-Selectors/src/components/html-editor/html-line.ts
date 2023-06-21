import { HtmlPattern } from 'types';
import ElementCreator from 'utils/element-creator';

function getId(pattern: HtmlPattern): string {
  if (!pattern.pseudo?.id) {
    return '';
  }
  return ` id="${pattern.pseudo.id}"`;
}

function getClasses(pattern: HtmlPattern): string {
  if (!pattern.pseudo?.classes) {
    return '';
  }
  return ` class="${pattern.pseudo.classes.join(' ')}"`;
}

function getHtmlString(pattern: HtmlPattern, closingTag: boolean): string {
  if (closingTag) {
    return `</${pattern.pseudo.tag}>`;
  }
  let close = '';
  if (!pattern.child) {
    close = '/';
  }
  return `<${pattern.pseudo.tag}${getId(pattern)}${getClasses(pattern)}${close}>`;
}

function addLineOfCode(pattern: HtmlPattern, closingTag = false): ElementCreator {
  const line = new ElementCreator({ tag: 'pre' });
  const code = new ElementCreator({
    tag: 'code',
    classes: ['language-html'],
    textContent: getHtmlString(pattern, closingTag),
  });
  line.addInnerElement(code);
  return line;
}

export default class HtmlLine extends ElementCreator {
  constructor(pattern: HtmlPattern) {
    super({ tag: 'div', classes: ['line'] });

    const line = addLineOfCode(pattern);
    this.addInnerElement(line);
  }

  public addClosingTag(pattern: HtmlPattern): void {
    const line = addLineOfCode(pattern, true);
    this.addInnerElement(line);
  }
}
