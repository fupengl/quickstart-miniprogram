

declare namespace Component {

    interface ComponentOptions {
        multipleSlots: boolean
    }

    interface ComponentInstanceBaseProps<D extends IAnyObject = any> {
        /** 页面的初始数据
         * 
         * `data` 是页面第一次渲染使用的**初始数据**。
         * 
         * 页面加载时，`data` 将会以`JSON`字符串的形式由逻辑层传至渲染层，因此`data`中的数据必须是可以转成`JSON`的类型：字符串，数字，布尔值，对象，数组。
         * 
         * 渲染层可以通过 `WXML` 对数据进行绑定。
        */
        data?: D

        /** `setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data` 的值（同步）。
         *
         * **注意：**
         *
         * 1. **直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致**。
         * 1. 仅支持设置可 JSON 化的数据。
         * 1. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
         * 1. 请不要把 data 中任何一项的 value 设为 `undefined` ，否则这一项将不被设置并可能遗留一些潜在问题。
         */

        setData?<K extends keyof D>(
            /** 这次要改变的数据
             *
             * 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。
             *
             * 其中 `key` 可以以数据路径的形式给出，支持改变数组中的某一项或对象的某个属性，如 `array[2].message`，`a.b.c.d`，并且不需要在 this.data 中预先定义。
             */
            data: D | Pick<D, K> | IAnyObject,
            /** setData引起的界面更新渲染完毕后的回调函数，最低基础库： `1.5.0` */
            callback?: () => void
        ): void

        options?: ComponentOptions

        behaviors?: Array[string]

        properties?: {
            [prop: string]: {
                value?: any
                type?: Boolean | Array | String | Number,
                observer?(): void
            }
        },

        methods?: {
            [eventName: string]: (...params?: any) => any
        }
    }

    // https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html
    interface ComponentInstance<D extends IAnyObject = any, T extends IAnyObject = any> extends ComponentInstanceBaseProps<D> {
        created?(): void // 在组件实例刚刚被创建时执行	
        attached?(): void // 在组件实例进入页面节点树时执行	 
        ready?(): void // 在组件在视图层布局完成后执行	
        moved?(): void // 在组件实例被移动到节点树另一个位置时执行	
        detached?(): void // 在组件实例被从页面节点树移除时执行	
        error?(err: Error): void // 每当组件方法抛出错误时执行

        lifetimes?: {
            created?(): void // 在组件实例刚刚被创建时执行	
            attached?(): void // 在组件实例进入页面节点树时执行	
            ready?(): void // 在组件在视图层布局完成后执行	
            moved?(): void // 在组件实例被移动到节点树另一个位置时执行	
            detached?(): void // 在组件实例被从页面节点树移除时执行	
            error?(err: Error): void // 每当组件方法抛出错误时执行	
        }

        pageLifetimes?: {
            show?(): void // 组件所在的页面被展示时执行	
            hide?(): void // 组件所在的页面被隐藏时执行	
            resize?(): void // 组件所在的页面尺寸变化时执行	
        }
    }

    interface ComponentConstructor {
        <D extends IAnyObject, T extends IAnyObject & ComponentInstance>(
            options: ComponentInstance<D, T> & T
        ): void
    }

    interface GetCurrentPages {
        <D extends IAnyObject = {}, T extends IAnyObject = {}>(): (PageInstance<D, T> & T)[]
    }
}

declare const Component: Component.ComponentConstructor