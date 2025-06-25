import sequelize from '../database/db'
import {DataTypes} from "sequelize"

const users = sequelize.define("users", {
    user_id: {type: DataTypes.UUID, primaryKey: true},
    user_name: {type: DataTypes.STRING, allowNull: false},
    user_email: {type: DataTypes.STRING, allowNull: false, unique: true},
    user_password: {type: DataTypes.STRING, allowNull: false},
    user_img: {type: DataTypes.STRING, allowNull: true},
    user_date: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
    user_bio: {type: DataTypes.STRING, allowNull: true},
    user_last_seen: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {timestamps: false})

const contacts = sequelize.define("contacts", {
    contact_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
}, {timestamps: false})

const user_code = sequelize.define("user_code", {
    user_code_id: {type: DataTypes.UUID, primaryKey: true},
    user_code_email: {type: DataTypes.STRING, allowNull: false},
    user_code_body: {type: DataTypes.STRING, allowNull: false},
    user_code_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
}, {timestamps: false})

const user_tokens = sequelize.define("user_token", {
    user_token_id: {type: DataTypes.UUID, primaryKey: true},
    user_token_body: {type: DataTypes.STRING(1000), allowNull: false},
    user_token_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {timestamps: false})

const members = sequelize.define("member", {
    member_id: {type: DataTypes.UUID, primaryKey: true},
    member_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    member_status: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false})

const messenger = sequelize.define("messenger", {
    messenger_id: {type: DataTypes.UUID, primaryKey: true},
    messenger_name: {type: DataTypes.STRING, allowNull: false},
    messenger_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    messenger_image: {type: DataTypes.STRING, allowNull: true},
    messenger_desc: {type: DataTypes.STRING, allowNull: true},
    messenger_type: {type: DataTypes.STRING, allowNull: false, defaultValue: 'chat'},
}, {timestamps: false})

const messenger_settings = sequelize.define("messenger_settings", {
    messenger_setting_id: {type: DataTypes.UUID, primaryKey: true},
    messenger_setting_type: {type: DataTypes.STRING, allowNull: false, defaultValue: "private"}
}, {timestamps: false})

const messenger_reactions = sequelize.define("messenger_reactions", {
    messenger_reaction_id: {type: DataTypes.UUID, primaryKey: true},
}, {timestamps: false})

const message_reactions = sequelize.define("message_reactions", {
    message_reaction_id: {type: DataTypes.UUID, primaryKey: true},
}, {timestamps: false})

const reactions = sequelize.define("reactions", {
    reaction_id: {type: DataTypes.UUID, primaryKey: true},
    reaction_code: {type: DataTypes.STRING, allowNull: false},
    reaction_name: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false})

const removed_users = sequelize.define("removed_users", {
    removed_user_id: {type: DataTypes.UUID, primaryKey: true},
}, {timestamps: false})

const message = sequelize.define("message", {
    message_id: {type: DataTypes.UUID, primaryKey: true},
    message_text: {type: DataTypes.TEXT, allowNull: true},
    message_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    message_type: {type: DataTypes.STRING, allowNull: false},
    reply_id: {type: DataTypes.UUID, allowNull: true},
    parent_post_id: {type: DataTypes.UUID, allowNull: true}
}, {timestamps: false})

const message_file = sequelize.define("message_file", {
    message_file_id: {type: DataTypes.UUID, primaryKey: true},
    message_file_name: {type: DataTypes.STRING, allowNull: false},
    message_file_size: {type: DataTypes.INTEGER, allowNull: true},
    message_file_path: {type: DataTypes.UUID, allowNull: false},
}, {timestamps: false})

users.hasMany(user_tokens, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
user_tokens.belongsTo(users, {foreignKey: 'user_id'})

users.hasMany(contacts, {foreignKey: {name: 'owner_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
contacts.belongsTo(users, {foreignKey: 'owner_id'})

contacts.belongsTo(users, { foreignKey: 'user_id'})

users.hasMany(members, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
members.belongsTo(users, {foreignKey: 'user_id'})

messenger.hasMany(members, {foreignKey: {name: 'messenger_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
members.belongsTo(messenger, {foreignKey: 'messenger_id'})

messenger.hasMany(members, {foreignKey: 'messenger_id', as: 'user_member'})

users.hasMany(message, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message.belongsTo(users, {foreignKey: 'user_id'})

message.hasMany(message_file, {foreignKey: {name: 'message_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message_file.belongsTo(message, {foreignKey: 'message_id'})

messenger.hasMany(message, {foreignKey: {name: 'messenger_id', allowNull: true}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message.belongsTo(messenger, {foreignKey: 'messenger_id'})

users.hasMany(message, {foreignKey: {name: 'recipient_user_id', allowNull: true}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message.belongsTo(users, {foreignKey: 'recipient_user_id', as: 'recipient'})

message.belongsTo(message, {as: "reply", foreignKey: "reply_id"})
message.hasMany(message, { as: 'comments', foreignKey: 'parent_post_id' })
message.belongsTo(message, { as: 'post', foreignKey: 'parent_post_id' })

message.hasMany(message_reactions, {foreignKey: {name: 'message_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message_reactions.belongsTo(message, {foreignKey: 'message_id'})

users.hasMany(message_reactions, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message_reactions.belongsTo(users, {foreignKey: 'user_id'})

reactions.hasMany(message_reactions, {foreignKey: {name: 'reaction_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message_reactions.belongsTo(reactions, {foreignKey: 'reaction_id'})

messenger.hasOne(messenger_settings, {foreignKey: {name: 'messenger_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
messenger_settings.belongsTo(messenger, {foreignKey: 'messenger_id'})

messenger_settings.hasMany(messenger_reactions, {foreignKey: {name: 'messenger_setting_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
messenger_reactions.belongsTo(messenger_settings, {foreignKey: 'messenger_setting_id'})

reactions.hasMany(messenger_reactions, {foreignKey: {name: 'reaction_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})

messenger_reactions.belongsTo(reactions, { as: 'reaction', foreignKey: 'reaction_id' })

users.hasMany(removed_users, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
removed_users.belongsTo(users, {foreignKey: 'user_id'})

messenger.hasMany(removed_users, {foreignKey: {name: 'messenger_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
removed_users.belongsTo(messenger, {foreignKey: 'messenger_id'})

messenger.hasMany(members, {foreignKey: 'messenger_id', as: 'moderators'})

const index = {
    users,
    user_code,
    user_tokens,
    members,
    messenger,
    messenger_settings,
    messenger_reactions,
    reactions,
    removed_users,
    message,
    message_file,
    contacts,
    message_reactions
}

export default index