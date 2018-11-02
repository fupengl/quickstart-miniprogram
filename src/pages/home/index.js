import "./index.scss"
import {sayName} from "../../utils"
Page({
    onLoad(){
        console.log(process.env)
        sayName("张三")
    },
    toSubpackage(){
        wx.navigateTo({url:"/subpackages/product/buy/index"})
    }
})