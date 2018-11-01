interface IApiModule {
    [moduleName: string]: {
        [action: string]: {
            url: string;
            type: 'post' | 'get' | 'put' | 'delete';
            isAuth?: boolean, // check login status
            hasLoading?: boolean, // loading modal
            isLock?: boolean,
            headers?: object // default headers
        }
    };
}

const api: IApiModule = {
    Account: {
        Login: {
            url: 'account/public/miniappLogin',
            type: 'post',
            isAuth: false,
            isLock: true
        },
        GetUserInfo: {
            url: 'account/user/{pin_uid}/miniappGetUserInfo',
            type: 'post'
        },
        CustomerLogin: {
            url: 'spread/user/{pin_uid}/customers/login',
            type: 'get'
        }
    }
};

export const file: any = {
    upload: {
        prefix: 'https://kolrank.cdn.pinquest.cn/',
        url: 'https://app.pinquest.cn/',
        key: 'file'
    },
};

export default api;
