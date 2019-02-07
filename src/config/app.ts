
interface IConfig {
  wxAppId: string;
}

// app custom config
const config: IConfig = {
  wxAppId: wx.getAccountInfoSync().miniProgram.appId
};

// app version
const version: string = 'quickstart-miniprogram-1.0.0';

function getCurrentConfig(): IConfig & IEnvironmentMode {
  return Object.assign({}, config, process.env);
}

const currentConfig = getCurrentConfig();
console.warn('App Config', currentConfig);

const isProd = currentConfig.ENV === 'production';

export default {
  version,
  isProd,
  config: currentConfig,
};
