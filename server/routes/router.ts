import {
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    REFRESH_ROUTE,
    REGISTRATION_ROUTE,
    CONFIRM_EMAIL_ROUTE,
    SEND_CODE_ROUTE,
    DELETE_ACCOUNT_ROUTE,

    MESSENGER_ROUTE,
    GET_MESSENGERS_ROUTE,
    GET_MESSENGER_SETTINGS_ROUTE,
    UPDATE_MESSENGER_TYPE_ROUTE,
    UPDATE_MESSENGER_LINK_ROUTE,
    UPDATE_MESSENGER_MODERATORS_ROUTE,

    GET_MESSAGES_ROUTE,
    CREATE_MESSAGE_ROUTE,
    DELETE_MESSAGE_ROUTE,

    GET_REACTIONS_ROUTE,
    MESSAGE_REACTIONS_ROUTE,
    MESSENGER_REACTIONS_ROUTE,

    GET_CONTACTS_ROUTE,
    ADD_CONTACTS_TO_MESSENGER_ROUTE,

    ADD_MEMBER_ROUTE,
    DELETE_MEMBER_ROUTE,

    ADD_REMOVED_USER_ROUTE,
    DELETE_REMOVED_USER_ROUTE,

    GET_PROFILE_ROUTE,
    UPDATE_PASSWORD_ROUTE,

    SEARCH_MESSENGERS_ROUTE,
    SEARCH_MESSAGES_ROUTE,

    PRIVATE_CHAT_ROUTE,
} from "../utils/const"
import express from "express"
import UserController from "../controller/userController"
import AuthController from "../controller/authController"
import AuthService from "../service/authService"
import MessengerController from "../controller/messengerController"
import SearchController from "../controller/searchController"

const router = express.Router()
const authService = new AuthService()
const authController = new AuthController(authService)

// Auth
router.post(REGISTRATION_ROUTE, authController.registration)
router.post(LOGIN_ROUTE, authController.login)
router.post(LOGOUT_ROUTE, authController.logout)
router.get(REFRESH_ROUTE, authController.refresh)
router.post(DELETE_ACCOUNT_ROUTE, authController.deleteAccount)
router.post(SEND_CODE_ROUTE, authController.sendCode)
router.post(CONFIRM_EMAIL_ROUTE, authController.confirmEmail)

// Messenger
router.get(GET_MESSENGERS_ROUTE, UserController.fetchMessengersList)
router.get(GET_MESSAGES_ROUTE, UserController.fetchMessages)
router.post(CREATE_MESSAGE_ROUTE, UserController.postMessage)
router.get(CREATE_MESSAGE_ROUTE, UserController.fetchMessage)
router.delete(DELETE_MESSAGE_ROUTE, UserController.deleteMessage)

router.get(GET_CONTACTS_ROUTE, MessengerController.getContacts)
router.post(GET_CONTACTS_ROUTE, MessengerController.postContact)
router.delete(GET_CONTACTS_ROUTE, MessengerController.deleteContact)

router.get(MESSENGER_ROUTE, UserController.fetchMessenger)
router.post(MESSENGER_ROUTE, MessengerController.postMessenger)
router.put(MESSENGER_ROUTE, MessengerController.putMessenger)
router.delete(MESSENGER_ROUTE, MessengerController.deleteMessenger)

router.get(GET_MESSENGER_SETTINGS_ROUTE, MessengerController.getMessengerSettings)

router.get(GET_REACTIONS_ROUTE, MessengerController.getReactions)
router.post(MESSAGE_REACTIONS_ROUTE, MessengerController.postMessageReaction)
router.delete(MESSAGE_REACTIONS_ROUTE, MessengerController.deleteMessageReaction)

router.put(UPDATE_MESSENGER_TYPE_ROUTE, MessengerController.putMessengerType)
router.put(UPDATE_MESSENGER_LINK_ROUTE, MessengerController.putMessengerLink)
router.post(MESSENGER_REACTIONS_ROUTE, MessengerController.postMessengerReactions)
router.put(UPDATE_MESSENGER_MODERATORS_ROUTE, MessengerController.putMessengerModerators)

router.post(ADD_CONTACTS_TO_MESSENGER_ROUTE, MessengerController.postContactsMembers)
router.post(ADD_MEMBER_ROUTE, MessengerController.postMember)
router.delete(DELETE_MEMBER_ROUTE, MessengerController.deleteMember)
router.post(ADD_REMOVED_USER_ROUTE, MessengerController.postRemoved)
router.delete(DELETE_REMOVED_USER_ROUTE, MessengerController.deleteRemoved)

// Profile
router.get(GET_PROFILE_ROUTE, UserController.getProfile)
router.put(GET_PROFILE_ROUTE, UserController.putProfile)
router.put(UPDATE_PASSWORD_ROUTE, UserController.putPassword)

// Search
router.get(SEARCH_MESSENGERS_ROUTE, SearchController.getMessengers)
router.get(SEARCH_MESSAGES_ROUTE, SearchController.getMessages)

// Chat
router.delete(PRIVATE_CHAT_ROUTE, MessengerController.deleteChat)

export default router