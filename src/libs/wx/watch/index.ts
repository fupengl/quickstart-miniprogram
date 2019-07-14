/**
 * 设置监听器
 */
export function setWatcher() {
    const page = this;
    const { data = {}, watch = {} } = page;
    Object.keys(watch).forEach(v => {
        const key = v.split('.');
        let nowData = data;
        for (let i = 0; i < key.length - 1; i++) {
            nowData = nowData[key[i]];
        }
        const lastKey = key[key.length - 1];
        const watchFun = watch[v].handler || watch[v];
        const deep = watch[v].deep;
        observe(nowData, lastKey, watchFun, deep, page);
    });
}

/**
 * 监听属性 并执行监听函数
 */
function observe(obj, key, watchFun, deep, page) {
    let val = obj[key];
    if (deep && val != null && typeof val === 'object') {
        Object.keys(val).forEach(childKey => {
            observe(val, childKey, watchFun, deep, page);
        });
    }
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set(value) {
            watchFun.call(page, value, val);
            val = value;
            if (deep) {
                observe(obj, key, watchFun, deep, page);
            }
        },
        get() {
            return val;
        }
    });
}
