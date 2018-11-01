import {sayName} from "../../../utils"
import { Product } from '../productServer'
Page({
    onLoad(){
        console.log(process.env)
        new Product().printName()
        sayName("product DETAIL")
    }
})