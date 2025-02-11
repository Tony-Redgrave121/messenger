import {
    ACTIVATION_PAGE,
    DELETE_ACCOUNT_ROUTE,
    FETCH_MESSAGES,
    FETCH_MESSENGER, FETCH_MESSENGERS_LIST,
    LOGIN_ROUTE,
    LOGOUT_ROUTE, POST_MESSAGE,
    REFRESH_ROUTE,
    REGISTRATION_ROUTE,
} from "../utils/const"
import express from "express"
import UserController from "../controller/userController"
import AuthController from "../controller/authController"

const router = express.Router()

router.post(REGISTRATION_ROUTE, AuthController.registration)
router.post(LOGIN_ROUTE, AuthController.login)
router.post(LOGOUT_ROUTE, AuthController.logout)
router.get(REFRESH_ROUTE, AuthController.refresh)
router.get(ACTIVATION_PAGE, AuthController.activate)
router.post(DELETE_ACCOUNT_ROUTE, AuthController.deleteAccount)

router.get(FETCH_MESSENGER, UserController.fetchMessenger)
router.get(FETCH_MESSENGERS_LIST, UserController.fetchMessengersList)
router.get(FETCH_MESSAGES, UserController.fetchMessages)
router.post(POST_MESSAGE, UserController.postMessage)

export default router