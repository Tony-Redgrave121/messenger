"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_js_1 = __importDefault(require("../error/ApiError.js"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_js_1.default)
        res.status(err.status).json({ message: err.message });
    res.status(500).json({ message: 'Internal Server Error' });
};
exports.default = errorHandler;
