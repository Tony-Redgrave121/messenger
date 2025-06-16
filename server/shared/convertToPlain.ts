import {Model} from "sequelize";

function convertToPlain<T>(obj: Model<any, any>): T
function convertToPlain<T>(obj: Model<any, any>[]): T[]
function convertToPlain<T>(obj: Model<any, any> | Model<any, any>[]): T | T[] {
    if (Array.isArray(obj)) return obj.map(m => m.get({plain: true}))
    else return obj.get({plain: true})
}

export default convertToPlain