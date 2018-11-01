import { formatDate } from '../../utils';

Page({
    data: {
        showModalStatus: false
    },
    onLoad() {
        console.log('index', formatDate());
    },
    toggleModal() {
        this.setData({ showModalStatus: !this.data.showModalStatus });
    }
});
