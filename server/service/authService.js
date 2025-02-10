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
const tokenService_1 = __importDefault(require("./tokenService"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const models_1 = __importDefault(require("../model/models"));
const uuid = __importStar(require("uuid"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const filesUploadingService_1 = __importDefault(require("./filesUploadingService"));
const mailService_1 = __importDefault(require("./mailService"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
class AuthService {
    registration(user_body, user_files) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_name, user_email, user_password, user_bio } = user_body;
            const userCheck = yield models_1.default.users.findOne({ where: { user_email: user_email } });
            if (userCheck)
                return ApiError_1.default.badRequest(`User with email already exists`);
            let userImg = null;
            const user_id = uuid.v4(), user_activation_code = uuid.v4();
            if (user_files && user_files.user_image)
                userImg = (0, filesUploadingService_1.default)('/users' + user_id, user_files.user_image);
            if (userImg instanceof ApiError_1.default || !userImg)
                return ApiError_1.default.badRequest(`Error with user image creation`);
            const hash_user_password = yield bcrypt_1.default.hash(user_password, 5);
            yield models_1.default.users.create({ user_id: user_id, user_name, user_email, user_password: hash_user_password, user_img: userImg.file, user_activation_code: user_activation_code, user_bio: user_bio });
            const tokens = tokenService_1.default.generateToken({ user_id, user_email, user_name });
            yield tokenService_1.default.saveToken(user_id, tokens.refreshToken);
            yield mailService_1.default.sendMail(user_email, `${process.env.API_URL}/activate/${user_activation_code}`);
            return Object.assign(Object.assign({}, tokens), { user_id: user_id, user_name: user_name, user_email: user_email, user_state: false, user_img: userImg.file });
        });
    }
    login(user_body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_email, user_password } = user_body;
            const user = yield models_1.default.users.findOne({ where: { user_email: user_email } });
            if (!user)
                return ApiError_1.default.notFound("User account not found");
            let comparePassword = bcrypt_1.default.compareSync(user_password, user.user_password);
            if (!comparePassword)
                return ApiError_1.default.forbidden('Password is incorrect');
            const tokens = tokenService_1.default.generateToken({ user_id: user.user_id, user_email });
            yield tokenService_1.default.saveToken(user.user_id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user_id: user.user_id, user_name: user.user_name, user_email: user.user_email, user_state: user.user_state, user_img: user.user_img });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tokenService_1.default.deleteToken(refreshToken);
        });
    }
    deleteAccount(refreshToken, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.default.users.destroy({ where: { user_id: user_id } });
            const folderPath = path_1.default.resolve(__dirname + "/../src/static/users", user_id);
            fs.rmSync(folderPath, { recursive: true, force: true });
            return yield tokenService_1.default.deleteToken(refreshToken);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken)
                return ApiError_1.default.unauthorized("Unauthorized");
            const userData = tokenService_1.default.validateRefreshToken(refreshToken);
            const tokenDB = tokenService_1.default.findToken(refreshToken);
            if (!userData || !tokenDB || typeof userData === "string")
                return ApiError_1.default.unauthorized("Unauthorized");
            const user = yield models_1.default.users.findOne({ where: { user_id: userData.user_id } });
            if (!user)
                return ApiError_1.default.unauthorized("Unauthorized");
            const tokens = tokenService_1.default.generateToken({ user_id: user.user_id, user_email: user.user_email });
            yield tokenService_1.default.saveToken(user.user_id, tokens.refreshToken);
            yield tokenService_1.default.deleteToken(refreshToken);
            return Object.assign(Object.assign({}, tokens), { user_id: user.user_id, user_name: user.user_name, user_email: user.user_email, user_state: user.user_state, user_img: user.user_img });
        });
    }
}
exports.default = new AuthService();
