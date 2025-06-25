export default class ApiError extends Error {
    status: number
    message: string

    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }

    // Client errors responses
    static badRequest(message: string) {
        return new ApiError(400, message)
    }
    static unauthorized(message: string) {
        return new ApiError(401, message)
    }
    static forbidden(message: string) {
        return new ApiError(403, message)
    }
    static notFound(message: string) {
        return new ApiError(404, message)
    }
    static payloadTooLarge(message: string) {
        return new ApiError(413, message)
    }
    static locked(message: string) {
        return new ApiError(423, message)
    }
    static tooManyRequests(message: string) {
        return new ApiError(429, message)
    }

    // Server errors responses
    static internalServerError(message: string) {
        return new ApiError(500, message)
    }
    static badGateway(message: string) {
        return new ApiError(502, message)
    }
    static serviceUnavailable(message: string) {
        return new ApiError(503, message)
    }
    static gatewayTimeout(message: string) {
        return new ApiError(504, message)
    }
    static loopDetected(message: string) {
        return new ApiError(508, message)
    }
}
