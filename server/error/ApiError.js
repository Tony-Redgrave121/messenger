"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    // Client error responses
    static badRequest(message) {
        return new ApiError(400, message);
    }
    static unauthorized(message) {
        return new ApiError(401, message);
    }
    static forbidden(message) {
        return new ApiError(403, message);
    }
    static notFound(message) {
        return new ApiError(404, message);
    }
    static payloadTooLarge(message) {
        return new ApiError(413, message);
    }
    static locked(message) {
        return new ApiError(423, message);
    }
    static tooManyRequests(message) {
        return new ApiError(429, message);
    }
    // Server error responses
    static internalServerError(message) {
        return new ApiError(500, message);
    }
    static badGateway(message) {
        return new ApiError(502, message);
    }
    static serviceUnavailable(message) {
        return new ApiError(503, message);
    }
    static gatewayTimeout(message) {
        return new ApiError(504, message);
    }
    static loopDetected(message) {
        return new ApiError(508, message);
    }
}
exports.default = ApiError;
