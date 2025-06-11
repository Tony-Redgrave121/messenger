import {
    CONFIRM_EMAIL, SEND_CODE,
    DELETE_ACCOUNT_ROUTE, DELETE_MESSAGE,
    FETCH_MESSAGES, FETCH_MESSENGER,
    FETCH_MESSENGERS_LIST, LOGIN_ROUTE,
    LOGOUT_ROUTE, MESSAGE,
    REFRESH_ROUTE, REGISTRATION_ROUTE,
    CONTACTS, GET_MESSENGER_SETTINGS,
    GET_REACTIONS, PUT_MESSENGER_TYPE,
    PUT_MESSENGER_LINK, POST_MESSENGER_REACTIONS,
    PUT_MESSENGER_MODERATORS, POST_REMOVED,
    POST_CONTACTS_MEMBERS, POST_MEMBER,
    DELETE_REMOVED, DELETE_MEMBER,
    PROFILE, PASSWORD, REACTIONS, SEARCH_MESSENGERS, SEARCH_MESSAGES,
} from "../utils/const"
import express from "express"
import UserController from "../controller/userController"
import AuthController from "../controller/authController"
import MessengerController from "../controller/messengerController";
import SearchController from "../controller/searchController";

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
router.post(MESSAGE, UserController.postMessage)
router.get(MESSAGE, UserController.fetchMessage)
router.delete(DELETE_MESSAGE, UserController.deleteMessage)

router.get(CONTACTS, MessengerController.getContacts)
router.post(CONTACTS, MessengerController.postContact)
router.delete(CONTACTS, MessengerController.deleteContact)

router.post(FETCH_MESSENGER, MessengerController.postMessenger)
router.put(FETCH_MESSENGER, MessengerController.putMessenger)

router.get(GET_MESSENGER_SETTINGS, MessengerController.getMessengerSettings)

router.get(GET_REACTIONS, MessengerController.getReactions)
router.post(REACTIONS, MessengerController.postMessageReaction)
router.delete(REACTIONS, MessengerController.deleteMessageReaction)

router.put(PUT_MESSENGER_TYPE, MessengerController.putMessengerType)
router.put(PUT_MESSENGER_LINK, MessengerController.putMessengerLink)
router.post(POST_MESSENGER_REACTIONS, MessengerController.postMessengerReactions)
router.put(PUT_MESSENGER_MODERATORS, MessengerController.putMessengerModerators)
router.post(POST_CONTACTS_MEMBERS, MessengerController.postContactsMembers)
router.post(POST_MEMBER, MessengerController.postMember)
router.delete(DELETE_MEMBER, MessengerController.deleteMember)
router.post(POST_REMOVED, MessengerController.postRemoved)
router.delete(DELETE_REMOVED, MessengerController.deleteRemoved)

router.get(PROFILE, UserController.getProfile)
router.put(PROFILE, UserController.putProfile)
router.put(PASSWORD, UserController.putPassword)

router.get(SEARCH_MESSENGERS, SearchController.getMessengers)
router.get(SEARCH_MESSAGES, SearchController.getMessages)

export default router