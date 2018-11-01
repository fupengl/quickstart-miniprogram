interface IEnvironmentMode {
    ENV: string;
    BASE_API: number;
    APP_ID: string;
}

interface IConfig {
    wxAppId: string;
}

// app version
const version: string = '1.0.0';

const config: IConfig = {
    wxAppId: 'wx app id'
};

function getCurrentConfig(): IConfig & IEnvironmentMode {
    // @ts-ignore
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
