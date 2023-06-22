import { HtmlPattern } from 'types';

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

export function getHtmlString(pattern: HtmlPattern, closingTag: boolean): string {
  if (closingTag) {
    return `</${pattern.pseudo.tag}>`;
  }
  let close = '';
  if (!pattern.child) {
    close = '/';
  }
  return `<${pattern.pseudo.tag}${getId(pattern)}${getClasses(pattern)}${close}>`;
}
