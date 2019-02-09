
export default class {
  dataList: any = [];
  startClientX: any = null;
  operationWrapperWidth: any = null;

  /**
   * init relative data
   * @param {array} dataList list data
   * @param {number} operationWrapperWidth the operater width
   */
  initData({ datalist, operationWrapperWidth }: any) {
    this.operationWrapperWidth = operationWrapperWidth;
    this.dataList = datalist instanceof Array
      ? datalist.concat()
      : [datalist];
  }

  /**
   * touch start
   * 1. reset data
   * 2. get touch start x
   * @return {array} reseted list data
   */
  touchStart(e: any) {
    this._resetData();
    this.startClientX = this._getClientX(e);
    return this.dataList;
  }

  /**
   * touch move
   * @return {object} current item
   */
  touchMove(e: any) {
    const moveWidth = this._getMoveWidth(e);
    if (moveWidth > 0) { return; }

    this.dataList[this.getItemIndex(e)].left = Math.abs(moveWidth) > this.operationWrapperWidth
      ? -this.operationWrapperWidth
      : moveWidth;

    return this.dataList[this.getItemIndex(e)];
  }

  /**
   * touch end
   * @return {object} current item
   */
  touchEnd(e: any) {
    const moveWidth = this._getMoveWidth(e);
    let left = 0;

    // 向左滑动 且 滑动的距离已大于操作块宽度的一半
    if (moveWidth < 0 && Math.abs(moveWidth) > this.operationWrapperWidth / 2) {
      left = -this.operationWrapperWidth;
    }

    this.dataList[this.getItemIndex(e)].left = left;
    return this.dataList[this.getItemIndex(e)];
  }

  getItemIndex(e: any) {
    return e.currentTarget.dataset.index;
  }

  // 获取当前滑动手势下 距离页面可显示区域的 横坐标
  _getClientX(e: any) {
    const touch = e.changedTouches;
    if (touch.length === 1) { return touch[0].clientX; }
  }

  // 获取滑动过程中 滑动的宽度
  _getMoveWidth(e: any) {
    return this._getClientX(e) - this.startClientX;
  }

  _resetData() {
    this.startClientX = null;
    this.dataList.forEach((v: any) => { v.left = 0; });
  }
}
