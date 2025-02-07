"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = __importDefault(require("../db.js"));
const sequelize_1 = require("sequelize");
const users = db_js_1.default.define("users", {
    user_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    user_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user_email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    user_password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    user_img: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    user_date: { type: sequelize_1.DataTypes.DATE, allowNull: true, defaultValue: sequelize_1.DataTypes.NOW },
    user_bio: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    user_state: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    user_activation_code: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, { timestamps: false });
const user_tokens = db_js_1.default.define("user_token", {
    user_token_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    user_token_body: { type: sequelize_1.DataTypes.STRING(1000), allowNull: false },
    user_token_date: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
}, { timestamps: false });
const member = db_js_1.default.define("member", {
    member_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    member_date: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    member_status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { timestamps: false });
const messenger = db_js_1.default.define("messenger", {
    messenger_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    messenger_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    messenger_date: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    messenger_image: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    messenger_desc: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    messenger_type: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'chat' },
}, { timestamps: false });
const message = db_js_1.default.define("message", {
    message_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    message_text: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    message_date: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    message_type: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reply_id: { type: sequelize_1.DataTypes.UUID, allowNull: true }
}, { timestamps: false });
const message_file = db_js_1.default.define("message_file", {
    message_file_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    message_file_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { timestamps: false });
users.hasMany(user_tokens, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
user_tokens.belongsTo(users, { foreignKey: 'user_id' });
users.hasMany(member, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
member.belongsTo(users, { foreignKey: 'user_id' });
messenger.hasMany(member, { foreignKey: { name: 'messenger_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
member.belongsTo(messenger, { foreignKey: 'messenger_id' });
users.hasMany(message, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
message.belongsTo(users, { foreignKey: 'user_id' });
message.hasMany(message_file, { foreignKey: { name: 'message_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
message_file.belongsTo(message, { foreignKey: 'message_id' });
messenger.hasMany(message, { foreignKey: { name: 'messenger_id', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
message.belongsTo(messenger, { foreignKey: 'messenger_id' });
message.belongsTo(message, { as: "reply", foreignKey: "reply_id" });
const models = {
    users,
    user_tokens,
    member,
    messenger,
    message,
    message_file
};
exports.default = models;
