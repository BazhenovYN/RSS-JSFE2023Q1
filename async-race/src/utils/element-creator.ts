// https://stackoverflow.com/questions/59437256/how-to-create-interface-for-a-function-which-creates-a-nested-element-structure
// https://www.meziantou.net/write-your-own-dom-element-factory-for-typescript.htm

import type { DomElementProps } from 'types';

export default function createDomElement<T extends keyof HTMLElementTagNameMap>({
  tag,
  children,
  style,
  ...otherProps
}: DomElementProps<T>): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);

  // Adding properties
  Object.entries(otherProps).forEach(([key, value]) => {
    element[key as keyof typeof otherProps] = value;
  });

  // Adding children
  if (children) {
    Object.values(children).forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      } else {
        element.appendChild(createDomElement(child));
      }
    });
  }

  // Adding inline styles
  if (style) {
    Object.assign(element.style, style);
  }
    
  return element;
}
