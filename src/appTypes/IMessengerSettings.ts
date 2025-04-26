export default interface IMessengerSettings {
    message_setting_type: string,
    messenger_reactions: {
        reaction_id: string,
        reaction_code: string
    }[],
    removed_users: {
        removed_user_id: string,
        user_id: string
    }
}