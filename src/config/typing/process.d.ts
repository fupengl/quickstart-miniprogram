/**
 * process webpack环境变量
 */
declare interface IEnvironmentMode {
  ENV: 'production' | 'development';
  BASE_API: number;
  APP_ID: string;
}

declare var process: {
  env: IEnvironmentMode
};
