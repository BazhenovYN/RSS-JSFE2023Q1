import hljs from 'highlight.js/lib/common';

import { getHtmlString } from 'utils/utils';
import ElementCreator from 'utils/element-creator';

import type { HtmlPattern } from 'types';

function addLineOfCode(pattern: HtmlPattern, closingTag = false): ElementCreator {
  const line = new ElementCreator({ tag: 'pre' });
  const code = new ElementCreator({ tag: 'code', classes: ['language-xml'] });

  const html = hljs.highlight(getHtmlString(pattern, closingTag), { language: 'xml' }).value;
  code.setInnerHTML(html);
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
