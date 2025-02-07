"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../utils/const");
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const router = express_1.default.Router();
router.post(const_1.REGISTRATION_ROUTE, userController_1.default.registration);
router.post(const_1.LOGIN_ROUTE, userController_1.default.login);
router.post(const_1.LOGOUT_ROUTE, userController_1.default.logout);
router.get(const_1.REFRESH_ROUTE, userController_1.default.refresh);
router.get(const_1.ACTIVATION_PAGE, userController_1.default.activate);
router.post(const_1.DELETE_ACCOUNT_ROUTE, userController_1.default.deleteAccount);
router.get(const_1.FETCH_MESSENGERS, userController_1.default.fetchMessengers);
exports.default = router;
