import "./app.scss"
import _ from "lodash"
import {sayName} from "./utils"

App({
	onLaunch(){
        console.log(_.join(["i","am","appqqqqqqq"]))
		_.assign({},{name:"age"})
        sayName("李四")
	}
})