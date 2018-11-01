import Conf from '../../config';

export default {
    getToken(state: any) {
        return state.token;
    },
    getSellerInfo(state: any) {
        if (Object.keys(state.sellerInfo).length) {
            return state.sellerInfo;
        }
        return null;
    },
    getCustomerInfo(state: any) {
        if (Object.keys(state.customerInfo).length) {
            return state.customerInfo;
        }
        return null;
    }
};
