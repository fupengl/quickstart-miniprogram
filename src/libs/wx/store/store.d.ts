declare namespace wxStore {
  interface dispatchFunc {
    [funcName: string]: (state: object, params?: any) => Promise<any>;
  }

  interface mutationFunc {
    [funcName: string]: (state: object, params?: any) => void;
  }

  interface getterFunc {
    [funcName: string]: (state: object, params?: any) => any;
  }
}
