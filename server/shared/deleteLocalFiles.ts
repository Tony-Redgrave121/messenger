import path from "path";
import fs from "fs";
import ApiError from "../error/ApiError";

const deleteLocalFiles = async (nodesArr: string[], rmParams: object) => {
    try {
        const fullPath = path.resolve(__dirname + "/../src/static", ...nodesArr)
        if (fs.existsSync(fullPath)) await fs.promises.rm(fullPath, rmParams)
    } catch (e) {
        return ApiError.badRequest(`Error with image deleting`)
    }
}

export default deleteLocalFiles