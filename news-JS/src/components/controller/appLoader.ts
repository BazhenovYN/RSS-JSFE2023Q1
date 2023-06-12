import Loader from './loader';

const BASE_LINK = 'https://rss-news-api.onrender.com/';
const API_KEY = '0e8f1ad263c5464b98e871f58b7b783e';

class AppLoader extends Loader {
  constructor() {
    super(BASE_LINK, { apiKey: API_KEY });
  }
}

export default AppLoader;
