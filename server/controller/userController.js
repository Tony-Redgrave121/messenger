"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../error/ApiError"));
const userService_1 = __importDefault(require("../service/userService"));
const userService_2 = __importDefault(require("../service/userService"));
class UserController {
    fetchMessenger(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching the messenger'));
                const messengers = yield userService_1.default.fetchMessenger(req.params.user_id);
                if (messengers instanceof ApiError_1.default)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching the messenger'));
                return res.json(messengers);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while fetching the messenger"));
            }
        });
    }
    fetchMessengersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching messengers list'));
                const messengers = yield userService_1.default.fetchMessengersList(req.params.user_id);
                if (messengers instanceof ApiError_1.default)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching messengers list'));
                return res.json(messengers);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while fetching messengers list"));
            }
        });
    }
    fetchMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, messenger_id } = req.query;
                if (!user_id || !messenger_id || typeof user_id !== 'string' || typeof messenger_id !== 'string')
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching messages'));
                const messages = yield userService_1.default.fetchMessages(user_id, messenger_id);
                if (messages instanceof ApiError_1.default)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while fetching messages'));
                return res.json(messages);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while fetching the messages"));
            }
        });
    }
    postMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, messenger_id, reply_id, message_text, message_type } = req.body;
                if (!user_id || !messenger_id || !message_type)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while posting the message'));
                const message = {
                    user_id: user_id,
                    messenger_id: messenger_id,
                    reply_id: reply_id ? reply_id : null,
                    message_text: message_text,
                    message_type: message_type
                };
                const data = yield userService_2.default.postMessage(message, req.files);
                if (data instanceof ApiError_1.default)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while posting the message'));
                return true;
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError('An error occurred while posting the message'));
            }
        });
    }
}
exports.default = new UserController();
