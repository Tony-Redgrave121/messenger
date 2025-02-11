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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = filesUploadingService;
const uuid = __importStar(require("uuid"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ApiError_js_1 = __importDefault(require("../error/ApiError.js"));
function filesUploadingService(folder, file) {
    try {
        const fileExt = file.name.split('.').pop().toLowerCase();
        const resFile = uuid.v4() + "." + fileExt;
        const folderPath = path.join(__dirname + "/../src/static", folder);
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });
        file.mv(path.resolve(folderPath, resFile));
        return { file: resFile, size: file.size };
    }
    catch (e) {
        return ApiError_js_1.default.internalServerError('An error occurred while uploading the file');
    }
}
