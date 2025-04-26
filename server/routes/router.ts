import {
    CONFIRM_EMAIL,
    SEND_CODE,
    DELETE_ACCOUNT_ROUTE,
    DELETE_MESSAGE,
    FETCH_MESSAGES,
    FETCH_MESSENGER,
    FETCH_MESSENGERS_LIST,
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    POST_MESSAGE,
    REFRESH_ROUTE,
    REGISTRATION_ROUTE,
    GET_CONTACTS, GET_MESSENGER_SETTINGS
} from "../utils/const"
import express from "express"
import UserController from "../controller/userController"
import AuthController from "../controller/authController"
import MessengerController from "../controller/messengerController";

const router = express.Router()

router.post(REGISTRATION_ROUTE, AuthController.registration)
router.post(LOGIN_ROUTE, AuthController.login)
router.post(LOGOUT_ROUTE, AuthController.logout)
router.get(REFRESH_ROUTE, AuthController.refresh)
router.post(DELETE_ACCOUNT_ROUTE, AuthController.deleteAccount)

router.post(SEND_CODE, AuthController.sendCode)
router.post(CONFIRM_EMAIL, AuthController.confirmEmail)

router.get(FETCH_MESSENGER, UserController.fetchMessenger)
router.get(FETCH_MESSENGERS_LIST, UserController.fetchMessengersList)
router.get(FETCH_MESSAGES, UserController.fetchMessages)
router.post(POST_MESSAGE, UserController.postMessage)
router.delete(DELETE_MESSAGE, UserController.deleteMessage)

router.get(GET_CONTACTS, MessengerController.getContacts)
router.post(FETCH_MESSENGER, MessengerController.postMessenger)

router.get(GET_MESSENGER_SETTINGS, MessengerController.getMessengerSettings)

export default router