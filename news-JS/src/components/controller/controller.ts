import { IDrawSourcesFunc, IDrawNewsFunc, APIEndpoint } from '../../types';
import AppLoader from './appLoader';

class AppController extends AppLoader {
  public getSources(callback: IDrawSourcesFunc): void {
    super.getResp(APIEndpoint.Sources, callback);
  }

  public getNews(event: MouseEvent, callback: IDrawNewsFunc): void {
    let { target } = event;
    const newsContainer = event.currentTarget;

    while (target instanceof Element && target !== newsContainer) {
      if (target.classList.contains('source__item')) {
        const sourceId = target.getAttribute('data-source-id');
        if (newsContainer instanceof Element) {
          if (newsContainer.getAttribute('data-source') !== sourceId && sourceId) {
            newsContainer.setAttribute('data-source', sourceId);
            super.getResp(APIEndpoint.Everything, callback, { sources: sourceId });
          }
        }
        return;
      }
      target = target.parentNode;
    }
  }
}

export default AppController;
