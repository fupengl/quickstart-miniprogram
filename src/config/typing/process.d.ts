/**
 * process webpack环境变量
 */
declare interface IEnvironmentMode {
  ENV: 'production' | 'development';
  BASE_API: string;
  APP_ID: number;
}

declare var process: {
  env: IEnvironmentMode
};
