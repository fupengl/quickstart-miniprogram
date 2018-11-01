import {sayName} from "../../../utils"
Page({
    onLoad(){
        console.log(process.env)
        sayName("articleList")
    }
})