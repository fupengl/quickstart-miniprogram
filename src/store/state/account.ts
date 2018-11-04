export interface IAccount {
    token?: IToken | object;
    corpInfo?: any;
    sellerInfo?: any;
    customerInfo?: any;
    [propName: string]: any;
}

export interface IToken {
    pin_uid: number;
    token: string;
}

export const account: IAccount = {
    token: {},
    corpInfo: {},
    customerInfo: {},
    sellerInfo: {},
    spreadInfo: {}, // 传播者信息，用于传播落地页，传播员工首页中使用
};
