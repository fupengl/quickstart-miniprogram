
declare interface IRouteModule {
  [moduleName: string]: {
    url: string;
  };
}

// app pages config map
const pageRoutes: IRouteModule = {
  INDEX: {
    url: 'index'
  },
  LOGS: {
    url: 'logs'
  }
};

/**
 * 根据 pagename 自动补全路径
 * (文件命名规则为 /pages/pagename/pagename.[ts/scss/json/wxml])
 */
function prefixRouter(rootName: string, routesConf: IRouteModule): IRouteModule {
  const res: IRouteModule = {};

  for (const route in routesConf) {
    const url = routesConf[route].url;
    const temp = url.split('/').filter(v => v);

    if (url[0] === '/' || temp[0] === rootName) {
      res[route] = routesConf[route];
    } else {
      res[route] = {
        url: `/${rootName}/${url}/${temp[temp.length - 1]}`
      };
    }
  }
  return res;
}

const routeConf = {
  ...prefixRouter('pages', pageRoutes)
};
console.warn('Route Config ', routeConf);

export default routeConf;
