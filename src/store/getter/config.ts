import file from '../../config/api';

export default {
    sourcePrefixHost(state: any, key: string = '') {
        return (state['resource-prefix'] || file.prefixSource) + key;
    }
};
