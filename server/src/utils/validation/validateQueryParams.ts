import ApiError from "../../errors/apiError";

type ParsedQs = {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

const validateQueryParams = <T extends string>(params: ParsedQs, requiredFields: T[]) => {
    const validatedParams = {} as Record<T, string>

    for (const field of requiredFields) {
        const value = params[field]

        if (typeof value !== 'string') {
            throw ApiError.badRequest(`Missing or invalid field: ${field}`)
        }

        validatedParams[field] = value
    }

    return validatedParams
}

export default validateQueryParams