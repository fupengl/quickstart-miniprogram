import { promisify } from './api';

export function createWxApi(options= {
  toastMask: true,
  toastDuration: 2000
}) {
  this.wxApi = promisify(options);
}
