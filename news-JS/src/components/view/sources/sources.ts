import { ISource } from '../../../types';
import { getElement } from '../../../utils';
import './sources.css';

function generateHtml(data: ISource[]): void {
  const fragment: DocumentFragment = document.createDocumentFragment();
  const sourceItemTemp = getElement<HTMLTemplateElement>(document, '#sourceItemTemp');

  if (!sourceItemTemp) return;

  data.forEach((item: ISource) => {
    const sourceClone: Node = sourceItemTemp.content.cloneNode(true);
    if (sourceClone instanceof DocumentFragment) {
      getElement<HTMLDivElement>(sourceClone, '.source__item-name').textContent = item.name;
      getElement<HTMLDivElement>(sourceClone, '.source__item').setAttribute('data-source-id', item.id);
      fragment.append(sourceClone);
    }
  });

  const sources = getElement<HTMLDivElement>(document, '#sources');
  sources.replaceChildren(fragment);
}

class Sources {
  private sources: ISource[] = [];

  public draw(data: ISource[] = []): void {
    if (data.length === 0 && this.sources.length === 0) {
      return;
    }

    this.sources = data;

    generateHtml(this.sources);
  }

  public filter(): void {
    const input = getElement<HTMLInputElement>(document, '.search');
    if (input.value === '') {
      generateHtml(this.sources);
      return;
    }

    const data = this.sources.filter((item: ISource) =>
      item.name.toLocaleUpperCase().startsWith(input.value.toLocaleUpperCase()),
    );
    generateHtml(data);
  }
}

export default Sources;
