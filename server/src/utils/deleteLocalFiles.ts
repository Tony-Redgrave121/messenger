import path from "path";
import fs from "fs";
import ApiError from "../errors/apiError";

const deleteLocalFiles = async (nodesArr: string[], rmParams: object) => {
    try {
        const fullPath = path.join(__dirname + "../../../static", ...nodesArr)

        if (fs.existsSync(fullPath)) await fs.promises.rm(fullPath, rmParams)
    } catch (e) {
        return ApiError.badRequest(`Error with image deleting`)
    }
}

export default deleteLocalFiles