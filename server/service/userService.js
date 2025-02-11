"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const uuid = __importStar(require("uuid"));
const filesUploadingService_1 = __importDefault(require("./filesUploadingService"));
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
                where: { messenger_id: messenger_id },
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
                order: [['message_date', 'ASC']]
            });
            if (!messages)
                return ApiError_1.default.internalServerError("An error occurred while fetching the messages");
            return messages;
        });
    }
    postMessage(message, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const message_id = uuid.v4();
            const messagePost = yield models_1.default.message.create({
                message_id: message_id,
                message_text: message.message_text,
                message_type: message.message_type,
                reply_id: message.reply_id,
                user_id: message.user_id,
                messenger_id: message.messenger_id,
            });
            if (files && files.message_files) {
                const fileArray = Array.isArray(files.message_files) ? files.message_files : [files.message_files];
                for (const file of fileArray) {
                    const message_file_id = uuid.v4();
                    const filesPost = (0, filesUploadingService_1.default)(`messengers/${message.messenger_id}`, file);
                    if (filesPost instanceof ApiError_1.default || !filesPost)
                        return ApiError_1.default.badRequest(`Error with files uploading`);
                    yield models_1.default.message_file.create({
                        message_file_id: message_file_id,
                        message_file_name: filesPost.file,
                        message_file_size: filesPost.size,
                        message_id: message_id
                    });
                }
            }
            return messagePost;
        });
    }
}
exports.default = new UserService();
