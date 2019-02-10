interface IApiModule {
  [moduleName: string]: IModules;
}

interface IModules {
  [key: string]: IApi;
}

interface IApi {
  url: string;
  method: 'get' | 'post' | 'delete' | 'put';
  isAuth?: boolean; // add session_id
  isJson?: boolean; // json or formdata
  isFile?: boolean; // multipart file
  headers?: object; // default header
}
