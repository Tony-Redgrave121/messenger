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

    GET_FILE_ROUTE, OPEN_GRAPH_ROUTE,
} from "../utils/consts/routes"
import express from "express"

import authController from "../config/auth.config"
import messageController from "../config/message.config";
import userController from "../config/user.config";
import messengerManagementController from "../config/messengerManagement.config";
import messengerSettingsController from "../config/messengerSettings.config";
import searchController from "../config/search.config"
import fileController from "../config/file.config";
import openGraphController from "../config/openGraph.config";

const index = express.Router()

// Auth
index.post(REGISTRATION_ROUTE, authController.registration)
index.post(LOGIN_ROUTE, authController.login)
index.post(LOGOUT_ROUTE, authController.logout)
index.get(REFRESH_ROUTE, authController.refresh)
index.post(DELETE_ACCOUNT_ROUTE, authController.deleteAccount)
index.post(SEND_CODE_ROUTE, authController.sendCode)
index.post(CONFIRM_EMAIL_ROUTE, authController.confirmEmail)

// Messenger
index.get(GET_MESSENGERS_ROUTE, messengerManagementController.fetchMessengersList)
index.get(GET_MESSAGES_ROUTE, messageController.fetchMessages)
index.post(CREATE_MESSAGE_ROUTE, messageController.postMessage)
index.get(CREATE_MESSAGE_ROUTE, messageController.fetchMessage)
index.delete(DELETE_MESSAGE_ROUTE, messageController.deleteMessage)

index.get(GET_CONTACTS_ROUTE, userController.getContacts)
index.post(GET_CONTACTS_ROUTE, userController.postContact)
index.delete(GET_CONTACTS_ROUTE, userController.deleteContact)

index.get(MESSENGER_ROUTE, messengerManagementController.fetchMessenger)
index.post(MESSENGER_ROUTE, messengerManagementController.postMessenger)
index.put(MESSENGER_ROUTE, messengerSettingsController.putMessenger)
index.delete(MESSENGER_ROUTE, messengerManagementController.deleteMessenger)

index.get(GET_MESSENGER_SETTINGS_ROUTE, messengerSettingsController.getMessengerSettings)

index.get(GET_REACTIONS_ROUTE, messengerManagementController.getReactions)
index.post(MESSAGE_REACTIONS_ROUTE, messageController.postMessageReaction)
index.delete(MESSAGE_REACTIONS_ROUTE, messageController.deleteMessageReaction)

index.put(UPDATE_MESSENGER_TYPE_ROUTE, messengerSettingsController.putMessengerType)
index.put(UPDATE_MESSENGER_LINK_ROUTE, messengerSettingsController.putMessengerLink)
index.post(MESSENGER_REACTIONS_ROUTE, messengerSettingsController.postMessengerReactions)
index.put(UPDATE_MESSENGER_MODERATORS_ROUTE, messengerSettingsController.putMessengerModerators)

index.post(ADD_CONTACTS_TO_MESSENGER_ROUTE, messengerSettingsController.postContactsMembers)
index.post(ADD_MEMBER_ROUTE, messengerSettingsController.postMember)
index.delete(DELETE_MEMBER_ROUTE, messengerSettingsController.deleteMember)
index.post(ADD_REMOVED_USER_ROUTE, messengerSettingsController.postRemoved)
index.delete(DELETE_REMOVED_USER_ROUTE, messengerSettingsController.deleteRemoved)

// Profile
index.get(GET_PROFILE_ROUTE, userController.getProfile)
index.put(GET_PROFILE_ROUTE, userController.putProfile)
index.put(UPDATE_PASSWORD_ROUTE, userController.putPassword)

// Search
index.get(SEARCH_MESSENGERS_ROUTE, searchController.getMessengers)
index.get(SEARCH_MESSAGES_ROUTE, searchController.getMessages)

// Chat
index.delete(PRIVATE_CHAT_ROUTE, messengerManagementController.deleteChat)

// File
index.get(GET_FILE_ROUTE, fileController.getFile)

// Open Graph
index.get(OPEN_GRAPH_ROUTE, openGraphController.getMetaData)

export default index