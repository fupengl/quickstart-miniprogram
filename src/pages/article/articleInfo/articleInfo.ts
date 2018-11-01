import { strFormat } from '../../../utils';

Page({
    onLoad() {
        console.log( strFormat('articleInfo {id}', {id: 1}));
    }
});
