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
const userService_1 = __importDefault(require("../service/userService"));
class UserController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userService_1.default.registration(req.body, req.files);
                if (userData instanceof ApiError_1.default)
                    return res.json(userData);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError('An error occurred while registration'));
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userService_1.default.login(req.body);
                if (userData instanceof ApiError_1.default)
                    return res.json(userData);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError('An error occurred while login'));
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield userService_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while logging out"));
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield userService_1.default.deleteAccount(refreshToken, req.body.user_id);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while deleting account"));
            }
        });
    }
    activate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const link = req.params.link;
                const user = yield models_1.default.users.findOne({ where: { user_activation_link: link } });
                if (!user)
                    return res.json(ApiError_1.default.notFound("User not found")).redirect(process.env.CLIENT_URL);
                user.user_state = true;
                yield user.save();
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError('An error occurred while activating account'));
            }
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const userData = yield userService_1.default.refresh(refreshToken);
                if (userData instanceof ApiError_1.default)
                    return res.json(ApiError_1.default.internalServerError('An error occurred while refreshing'));
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while refreshing"));
            }
        });
    }
    fetchMessengers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                return res.json(ApiError_1.default.internalServerError("An error occurred while fetching the messengers"));
            }
            if (!req.params)
                return res.json(ApiError_1.default.internalServerError('An error occurred while fetching the messengers'));
            const messengers = yield userService_1.default.fetchMessengers(req.params.user_id);
            if (messengers instanceof ApiError_1.default)
                return res.json(ApiError_1.default.internalServerError('An error occurred while fetching the messengers'));
            return res.json(messengers);
        });
    }
}
exports.default = new UserController();
