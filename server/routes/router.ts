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

import authController from "../configs/authConfig"
import messageController from "../configs/messageConfig";
import userController from "../configs/userConfig";
import messengerManagementController from "../configs/messengerManagementConfig";
import messengerSettingsController from "../configs/messengerSettingsConfig";
import searchController from "../configs/searchConfig"

const router = express.Router()

// Auth
router.post(REGISTRATION_ROUTE, authController.registration)
router.post(LOGIN_ROUTE, authController.login)
router.post(LOGOUT_ROUTE, authController.logout)
router.get(REFRESH_ROUTE, authController.refresh)
router.post(DELETE_ACCOUNT_ROUTE, authController.deleteAccount)
router.post(SEND_CODE_ROUTE, authController.sendCode)
router.post(CONFIRM_EMAIL_ROUTE, authController.confirmEmail)

// Messenger
router.get(GET_MESSENGERS_ROUTE, messengerManagementController.fetchMessengersList)
router.get(GET_MESSAGES_ROUTE, messageController.fetchMessages)
router.post(CREATE_MESSAGE_ROUTE, messageController.postMessage)
router.get(CREATE_MESSAGE_ROUTE, messageController.fetchMessage)
router.delete(DELETE_MESSAGE_ROUTE, messageController.deleteMessage)

router.get(GET_CONTACTS_ROUTE, userController.getContacts)
router.post(GET_CONTACTS_ROUTE, userController.postContact)
router.delete(GET_CONTACTS_ROUTE, userController.deleteContact)

router.get(MESSENGER_ROUTE, messengerManagementController.fetchMessenger)
router.post(MESSENGER_ROUTE, messengerManagementController.postMessenger)
router.put(MESSENGER_ROUTE, messengerSettingsController.putMessenger)
router.delete(MESSENGER_ROUTE, messengerManagementController.deleteMessenger)

router.get(GET_MESSENGER_SETTINGS_ROUTE, messengerSettingsController.getMessengerSettings)

router.get(GET_REACTIONS_ROUTE, messengerManagementController.getReactions)
router.post(MESSAGE_REACTIONS_ROUTE, messageController.postMessageReaction)
router.delete(MESSAGE_REACTIONS_ROUTE, messageController.deleteMessageReaction)

router.put(UPDATE_MESSENGER_TYPE_ROUTE, messengerSettingsController.putMessengerType)
router.put(UPDATE_MESSENGER_LINK_ROUTE, messengerSettingsController.putMessengerLink)
router.post(MESSENGER_REACTIONS_ROUTE, messengerSettingsController.postMessengerReactions)
router.put(UPDATE_MESSENGER_MODERATORS_ROUTE, messengerSettingsController.putMessengerModerators)

router.post(ADD_CONTACTS_TO_MESSENGER_ROUTE, messengerSettingsController.postContactsMembers)
router.post(ADD_MEMBER_ROUTE, messengerSettingsController.postMember)
router.delete(DELETE_MEMBER_ROUTE, messengerSettingsController.deleteMember)
router.post(ADD_REMOVED_USER_ROUTE, messengerSettingsController.postRemoved)
router.delete(DELETE_REMOVED_USER_ROUTE, messengerSettingsController.deleteRemoved)

// Profile
router.get(GET_PROFILE_ROUTE, userController.getProfile)
router.put(GET_PROFILE_ROUTE, userController.putProfile)
router.put(UPDATE_PASSWORD_ROUTE, userController.putPassword)

// Search
router.get(SEARCH_MESSENGERS_ROUTE, searchController.getMessengers)
router.get(SEARCH_MESSAGES_ROUTE, searchController.getMessages)

// Chat
router.delete(PRIVATE_CHAT_ROUTE, messengerManagementController.deleteChat)

export default router