declare interface IApiModule {
  [action: string]: {
    url: string;
    type: 'post' | 'get' | 'put' | 'delete';
    isAuth?: boolean, // check login status
    hasLoading?: boolean, // loading modal
    isLock?: boolean,
    headers?: object // default headers
  };
}
