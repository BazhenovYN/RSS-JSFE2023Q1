import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    super('https://newsapi.org/v2/', {
      apiKey: '0e8f1ad263c5464b98e871f58b7b783e',
    });
  }
}

export default AppLoader;
