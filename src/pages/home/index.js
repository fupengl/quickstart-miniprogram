import "./index.scss"
import {sayName} from "../../utils"
Page({
    onLoad(){
        console.log(process.env)
        sayName("张三")
    }
})