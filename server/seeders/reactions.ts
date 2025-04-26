import * as uuid from "uuid"
import sequelize from "../db";
import models from "../model/models"

async function runSeeder() {
    await sequelize.authenticate()

    await models.reactions.bulkCreate([
        { reaction_id: uuid.v4(), reaction_code: '👍' },
        { reaction_id: uuid.v4(), reaction_code: '👎' },
        { reaction_id: uuid.v4(), reaction_code: '❤️' },
        { reaction_id: uuid.v4(), reaction_code: '🔥' },
        { reaction_id: uuid.v4(), reaction_code: '🥰' },
        { reaction_id: uuid.v4(), reaction_code: '👏' },
        { reaction_id: uuid.v4(), reaction_code: '😁' },
        { reaction_id: uuid.v4(), reaction_code: '🤔' },
        { reaction_id: uuid.v4(), reaction_code: '🤯' },
        { reaction_id: uuid.v4(), reaction_code: '😱' },
        { reaction_id: uuid.v4(), reaction_code: '🤬' },
        { reaction_id: uuid.v4(), reaction_code: '😢' },
        { reaction_id: uuid.v4(), reaction_code: '🎉' },
        { reaction_id: uuid.v4(), reaction_code: '🤩' },
        { reaction_id: uuid.v4(), reaction_code: '🤮' },
        { reaction_id: uuid.v4(), reaction_code: '💩' },
        { reaction_id: uuid.v4(), reaction_code: '🙏' },
        { reaction_id: uuid.v4(), reaction_code: '👌' },
        { reaction_id: uuid.v4(), reaction_code: '🤡' },
        { reaction_id: uuid.v4(), reaction_code: '💊' },
        { reaction_id: uuid.v4(), reaction_code: '🤣️' },
        { reaction_id: uuid.v4(), reaction_code: '😭' },
        { reaction_id: uuid.v4(), reaction_code: '😘' },
        { reaction_id: uuid.v4(), reaction_code: '💪' },
        { reaction_id: uuid.v4(), reaction_code: '😍' },
        { reaction_id: uuid.v4(), reaction_code: '💯' },
        { reaction_id: uuid.v4(), reaction_code: '🎉' },
        { reaction_id: uuid.v4(), reaction_code: '😁' },
        { reaction_id: uuid.v4(), reaction_code: '😡' },
        { reaction_id: uuid.v4(), reaction_code: '🥺' },
        { reaction_id: uuid.v4(), reaction_code: '💋' },
        { reaction_id: uuid.v4(), reaction_code: '🤦' },
        { reaction_id: uuid.v4(), reaction_code: '💀' },
        { reaction_id: uuid.v4(), reaction_code: '😴' },
        { reaction_id: uuid.v4(), reaction_code: '😐' },
        { reaction_id: uuid.v4(), reaction_code: '😇' },
        { reaction_id: uuid.v4(), reaction_code: '🖕' },
        { reaction_id: uuid.v4(), reaction_code: '🙈' },
        { reaction_id: uuid.v4(), reaction_code: '💅' },
        { reaction_id: uuid.v4(), reaction_code: '🆒' },
    ])

    process.exit()
}

runSeeder().catch((error) => {
    console.error('Seeding error: ', error)
    process.exit(1)
})