import { setWatcher } from './index';

export const WatcherPage: Page.PageConstructor = opt => {
  const { onLoad, ...page } = opt;
  // @ts-ignore
  page.onLoad = function (options) {
    setWatcher.call(this);
    if (onLoad) {
      onLoad.call(this, options);
    }
  };

  Page(page);
};
