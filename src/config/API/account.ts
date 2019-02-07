
export const api: IApiModule = {
  Login: {
    url: 'account/public/miniappLogin',
    type: 'post',
    isAuth: false,
    isLock: true
  }
};

export default api;
