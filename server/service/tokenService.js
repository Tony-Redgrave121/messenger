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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../model/models"));
const uuid = __importStar(require("uuid"));
class TokenService {
    generateToken(payload) {
        if (process.env.SECRET_ACCESS_KEY && process.env.SECRET_REFRESH_KEY) {
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_ACCESS_KEY, { expiresIn: '7d' });
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.SECRET_REFRESH_KEY, { expiresIn: '14d' });
            return { accessToken, refreshToken };
        }
    }
    validateRefreshToken(token) {
        try {
            return process.env.SECRET_REFRESH_KEY && jsonwebtoken_1.default.verify(token, process.env.SECRET_REFRESH_KEY);
        }
        catch (e) {
            return null;
        }
    }
    saveToken(user_id, user_token_body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.user_tokens.create({ user_token_id: uuid.v4(), user_token_body, user_id });
        });
    }
    deleteToken(user_token_body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.user_tokens.destroy({ where: { user_token_body: user_token_body } });
        });
    }
    findToken(user_token_body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.default.user_tokens.findOne({ where: { user_token_body: user_token_body } });
        });
    }
}
exports.default = new TokenService();
