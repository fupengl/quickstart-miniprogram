import "./index.scss"
import _ from "lodash"
import {sayName} from "../../utils"
Page({
    onLoad(){
        console.log(_.join(["i","am","pagewwwwww"]))
        console.log(process.env)
        sayName("张三")
    }
})