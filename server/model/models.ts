import sequelize from '../db.js'
import {DataTypes} from "sequelize"

const users = sequelize.define("users", {
    user_id: {type: DataTypes.UUID, primaryKey: true},
    user_name: {type: DataTypes.STRING, allowNull: false},
    user_email: {type: DataTypes.STRING, allowNull: false, unique: true},
    user_password: {type: DataTypes.STRING, allowNull: false},
    user_img: {type: DataTypes.STRING, allowNull: true},
    user_date: {type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW},
    user_bio: {type: DataTypes.STRING, allowNull: true},
}, {timestamps: false})

const user_code = sequelize.define("user_code", {
    user_code_id: {type: DataTypes.UUID, primaryKey: true},
    user_code_email: {type: DataTypes.STRING, allowNull: false},
    user_code_body: {type: DataTypes.STRING, allowNull: false},
    user_code_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
}, {timestamps: false});

const user_tokens = sequelize.define("user_token", {
    user_token_id: {type: DataTypes.UUID, primaryKey: true},
    user_token_body: {type: DataTypes.STRING(1000), allowNull: false},
    user_token_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {timestamps: false})

const member = sequelize.define("member", {
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

const message = sequelize.define("message", {
    message_id: {type: DataTypes.UUID, primaryKey: true},
    message_text: {type: DataTypes.STRING, allowNull: true},
    message_date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    message_type: {type: DataTypes.STRING, allowNull: false},
    reply_id: {type: DataTypes.UUID, allowNull: true}
}, {timestamps: false})

const message_file = sequelize.define("message_file", {
    message_file_id: {type: DataTypes.UUID, primaryKey: true},
    message_file_name: {type: DataTypes.STRING, allowNull: false},
    message_file_size: {type: DataTypes.INTEGER, allowNull: true},
}, {timestamps: false})

users.hasMany(user_tokens, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
user_tokens.belongsTo(users, {foreignKey: 'user_id'})

users.hasMany(member, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
member.belongsTo(users, {foreignKey: 'user_id'})

messenger.hasMany(member, {foreignKey: {name: 'messenger_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
member.belongsTo(messenger, {foreignKey: 'messenger_id'})

users.hasMany(message, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message.belongsTo(users, {foreignKey: 'user_id'})

message.hasMany(message_file, {foreignKey: {name: 'message_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message_file.belongsTo(message, {foreignKey: 'message_id'})

messenger.hasMany(message, {foreignKey: {name: 'messenger_id', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
message.belongsTo(messenger, {foreignKey: 'messenger_id'})

message.belongsTo(message, {as: "reply", foreignKey: "reply_id"})

const models = {
    users,
    user_code,
    user_tokens,
    member,
    messenger,
    message,
    message_file
}

export default models