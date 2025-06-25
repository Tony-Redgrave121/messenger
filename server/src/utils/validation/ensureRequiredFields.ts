import ApiError from "../../errors/apiError";

const ensureRequiredFields = (fields: any[]) => {
    for (const field of fields) {
        if (!field) {
            throw ApiError.badRequest('Missing required fields')
        }
    }
}

export default ensureRequiredFields