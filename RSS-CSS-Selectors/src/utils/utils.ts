import { HtmlPattern } from 'types';

function getId(pattern: HtmlPattern): string {
  if (!pattern?.id) {
    return '';
  }
  return ` id="${pattern.id}"`;
}

function getClasses(pattern: HtmlPattern): string {
  if (!pattern?.classes) {
    return '';
  }
  return ` class="${pattern.classes.join(' ')}"`;
}

export function getHtmlString(pattern: HtmlPattern, closingTag: boolean): string {
  if (closingTag) {
    return `</${pattern.tag}>`;
  }
  let close = '';
  if (!pattern.child) {
    close = '/';
  }
  return `<${pattern.tag}${getId(pattern)}${getClasses(pattern)}${close}>`;
}
