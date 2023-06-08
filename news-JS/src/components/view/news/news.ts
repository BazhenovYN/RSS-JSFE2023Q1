import { IArticle } from '../../../types';
import { getElement } from '../../../utils';
import './news.css';

class News {
  private news: IArticle[] = [];

  public draw(data: IArticle[] = []): void {
    if (data.length === 0 && this.news.length === 0) return;

    this.news = data.length >= 10 ? data.filter((_item: IArticle, idx: number) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();
    const newsItemTemp = getElement<HTMLTemplateElement>(document, '#newsItemTemp');

    this.news.forEach((item: IArticle, idx: number) => {
      const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

      if (idx % 2) {
        getElement<HTMLDivElement>(newsClone, '.news__item').classList.add('alt');
      }

      const photo = getElement<HTMLDivElement>(newsClone, '.news__meta-photo');
      if (item.urlToImage !== '') {
        photo.style.backgroundImage = `url(${item.urlToImage})`;
      }

      getElement<HTMLLIElement>(newsClone, '.news__meta-author').textContent = item.author || item.source.name;
      getElement<HTMLLIElement>(newsClone, '.news__meta-date').textContent = item.publishedAt
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('-');

      getElement<HTMLHeadingElement>(newsClone, '.news__description-title').textContent = item.title;
      getElement<HTMLHeadingElement>(newsClone, '.news__description-source').textContent = item.source.name;
      getElement<HTMLParagraphElement>(newsClone, '.news__description-content').textContent = item.description;
      getElement<HTMLAnchorElement>(newsClone, '.news__read-more a').setAttribute('href', item.url);

      fragment.append(newsClone);
    });

    getElement<HTMLDivElement>(document, '.news').innerHTML = '';
    getElement<HTMLDivElement>(document, '.news').appendChild(fragment);
  }
}

export default News;
