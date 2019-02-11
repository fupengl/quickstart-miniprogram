declare namespace IApi {

  interface api {
    url: string;
    method: 'get' | 'post' | 'delete' | 'put';
    isAuth?: boolean; // add session_id
    isJson?: boolean; // json or formdata
    isFile?: boolean; // multipart file
    headers?: object; // default header
  }

  interface module {
    [funcName: string]: api
  }

  interface modules {
    [moduleName: string]: module;
  }

}