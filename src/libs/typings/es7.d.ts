interface Object {
    entries<T>(object: { [key: number]: T }): Array<[string, T]>;
    entries<T>(object: { [key: string]: T }): Array<[string, T]>;
    entries(object: Object): Array<[string, any]>;
    values<T>(object: { [key: number]: T }): Array<T>;
    values<T>(object: { [key: string]: T }): Array<T>;
    values(object: Object): Array<any>;
    includes(object: { [key: string]: T }): Boolean;
}