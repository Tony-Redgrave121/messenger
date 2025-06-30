// User Routes
export const LOGIN_ROUTE = '/auth/login'
export const LOGOUT_ROUTE = '/auth/logout'
export const REFRESH_ROUTE = '/auth/refresh'
export const REGISTRATION_ROUTE = '/auth/registration'
export const CONFIRM_EMAIL_ROUTE = '/auth/confirm-email'
export const SEND_CODE_ROUTE = '/auth/send-code'
export const DELETE_ACCOUNT_ROUTE = '/auth/delete'

// Messenger Routes
export const MESSENGER_ROUTE = '/messenger'
export const GET_MESSENGERS_ROUTE = '/messengers/:user_id'
export const GET_MESSENGER_SETTINGS_ROUTE = '/messengers/:messenger_id/settings'
export const UPDATE_MESSENGER_TYPE_ROUTE = '/messengers/:messenger_id/type'
export const UPDATE_MESSENGER_LINK_ROUTE = '/messengers/:messenger_id/link'
export const UPDATE_MESSENGER_MODERATORS_ROUTE = '/messengers/:messenger_id/moderators'

// Message Routes
export const GET_MESSAGES_ROUTE = '/messages/:messenger_id'
export const CREATE_MESSAGE_ROUTE = '/messages'
export const DELETE_MESSAGE_ROUTE = '/messages/:message_id'

// Reaction Routes
export const GET_REACTIONS_ROUTE = '/reactions'
export const MESSAGE_REACTIONS_ROUTE = '/messages/:message_id/reactions'
export const MESSENGER_REACTIONS_ROUTE = '/settings/:messenger_setting_id/reactions'

// ContactSchema Routes
export const GET_CONTACTS_ROUTE = '/users/:user_id/contacts'
export const ADD_CONTACTS_TO_MESSENGER_ROUTE = '/messengers/:messenger_id/contacts'

// Member Routes
export const ADD_MEMBER_ROUTE = '/messengers/:messenger_id/members'
export const DELETE_MEMBER_ROUTE = '/messengers/:messenger_id/members/:user_id'

// Removed Users Routes
export const ADD_REMOVED_USER_ROUTE = '/messengers/:messenger_id/removed'
export const DELETE_REMOVED_USER_ROUTE = '/messengers/:messenger_id/removed/:user_id'

// Profile Routes
export const GET_PROFILE_ROUTE = '/users/:user_id/profile'
export const UPDATE_PASSWORD_ROUTE = '/users/:user_id/password'

// Search Routes
export const SEARCH_MESSENGERS_ROUTE = '/search/messengers'
export const SEARCH_MESSAGES_ROUTE = '/search/messages'

// Chat Route
export const PRIVATE_CHAT_ROUTE = '/chat/:user_id'