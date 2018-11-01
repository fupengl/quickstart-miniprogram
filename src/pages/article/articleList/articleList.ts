import { strFormat } from '../../../utils';

Page({
    onLoad() {
        console.log( strFormat('articleList {id}', {id: 2}));
    }
});
