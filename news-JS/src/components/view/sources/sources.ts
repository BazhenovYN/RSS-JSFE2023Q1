import { ISource } from '../../../types';
import { getElement } from '../../../utils';
import './sources.css';

class Sources {
  private sources: ISource[] = [];

  public draw(data: ISource[] = []): void {
    if (data.length === 0 && this.sources.length === 0) {
      return;
    }

    this.sources = data;

    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp = getElement<HTMLTemplateElement>(document, '#sourceItemTemp');

    if (!sourceItemTemp) return;
    
    this.sources.forEach((item: ISource) => {
      const sourceClone: Node = sourceItemTemp.content.cloneNode(true);
      if (sourceClone instanceof DocumentFragment) {
        getElement<HTMLDivElement>(sourceClone, '.source__item-name').textContent = item.name;
        getElement<HTMLDivElement>(sourceClone, '.source__item').setAttribute('data-source-id', item.id);
        fragment.append(sourceClone);
      }
    });

    getElement<HTMLDivElement>(document, '.sources').append(fragment);
  }
}

export default Sources;
