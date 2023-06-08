export const getElement = <T extends HTMLElement>(container: HTMLElement | Document | DocumentFragment, selector: string): T => {
  const element = container.querySelector<T>(selector);
  if (!element) {
      throw new Error(`Selector ${selector} didn't match any elements.`);
  };
  return element
}


