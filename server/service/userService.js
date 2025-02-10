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
const models_1 = __importDefault(require("../model/models"));
class UserService {
    fetchMessenger(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messenger");
            const messenger = yield models_1.default.messenger.findOne({
                include: [{
                        model: models_1.default.member,
                        where: { user_id: user_id }
                    }]
            });
            if (!messenger)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messenger");
            return messenger;
        });
    }
    fetchMessengersList(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id)
                return ApiError_1.default.internalServerError("An error occurred while fetching messengers list");
            const messengersList = yield models_1.default.messenger.findAll({
                include: [
                    {
                        model: models_1.default.member,
                        where: { user_id: user_id },
                        attributes: []
                    },
                    {
                        model: models_1.default.message,
                        limit: 1,
                        order: [['message_date', 'DESC']],
                        attributes: ['message_text', 'message_date']
                    }
                ],
                attributes: ['messenger_id', 'messenger_name', 'messenger_image', 'messenger_type']
            });
            if (!messengersList)
                return ApiError_1.default.internalServerError("An error occurred while fetching messengers list");
            return messengersList;
        });
    }
    fetchMessages(user_id, messenger_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messages");
            const messages = yield models_1.default.message.findAll({
                where: { user_id: user_id, messenger_id: messenger_id },
                include: [
                    { model: models_1.default.message_file, attributes: ['message_file_id', 'message_file_name', 'message_file_size'] },
                    { model: models_1.default.users, attributes: ['user_name'] },
                    {
                        model: models_1.default.message,
                        as: 'reply',
                        attributes: ['message_text'],
                        include: [{ model: models_1.default.users, attributes: ['user_name'] }]
                    }
                ],
                order: [['message_date', 'DESC']]
            });
            if (!messages)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messages");
            return messages;
        });
    }
    postMessage(message, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = yield models_1.default.messenger.findOne({
                include: [{
                        model: models_1.default.member,
                        where: { user_id: message }
                    }]
            });
            if (!messenger)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messenger");
            return messenger;
        });
    }
}
exports.default = new UserService();
