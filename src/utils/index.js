import _ from "lodash"

export function sayName(name) {
    console.log(_.join([name, "util"]))
}