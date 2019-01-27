
declare var process: {
    env: IEnvironmentMode
};

// process env
interface IEnvironmentMode {
    ENV: string;
    BASE_API: number;
    APP_ID: string;
}

// app config
interface IConfig {
    wxAppId: string;
}

// app version
const version: string = '1.0.0';

const config: IConfig = {
    wxAppId: wx.getAccountInfoSync().miniProgram.appId
};

function getCurrentConfig(): IConfig & IEnvironmentMode {
    return Object.assign({}, config, process.env as IEnvironmentMode);
}

const currentConfig = getCurrentConfig();
console.warn('App Config', currentConfig);

const isProd = currentConfig.ENV === 'production';

export default {
    version,
    isProd,
    config: currentConfig,
};
