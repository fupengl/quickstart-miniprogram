// app path config map
const config: IRouteModule = {
    INDEX: {
        url: 'index'
    },
    LOG: {
        url: 'log'
    }
};

interface IRouteModule {
    [moduleName: string]: {
        url: string;
    };
}

/**
 * 根据 pagename 自动补全路径
 * (文件命名规则为 /pages/pagename/pagename.[ts/scss/json/wxml])
 */
function prefixRouter(routesConf: IRouteModule): IRouteModule {
    const res: IRouteModule = {};

    for (const route in routesConf) {
        const url = routesConf[route].url;
        const temp = url.split('/');

        if (temp[0] === 'pages') {
            res[route] = routesConf[route];
        } else {
            res[route] = {
                url: `/pages/${url}/${temp[temp.length - 1]}`
            };
        }
    }
    return res;
}

export default prefixRouter(config);
