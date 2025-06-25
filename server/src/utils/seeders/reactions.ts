import * as uuid from "uuid"
import sequelize from "../../database/db";
import index from "../../models"

async function runSeeder() {
    await sequelize.authenticate()

    await index.reactions.bulkCreate([
        {reaction_id: uuid.v4(), reaction_code: '👍', reaction_name: 'Like'},
        {reaction_id: uuid.v4(), reaction_code: '👎', reaction_name: 'Dislike'},
        {reaction_id: uuid.v4(), reaction_code: '❤️', reaction_name: 'Love'},
        {reaction_id: uuid.v4(), reaction_code: '🔥', reaction_name: 'Fire'},
        {reaction_id: uuid.v4(), reaction_code: '🥰', reaction_name: 'In Love'},
        {reaction_id: uuid.v4(), reaction_code: '👏', reaction_name: 'Applause'},
        {reaction_id: uuid.v4(), reaction_code: '😁', reaction_name: 'Happy'},
        {reaction_id: uuid.v4(), reaction_code: '🤔', reaction_name: 'Thinking'},
        {reaction_id: uuid.v4(), reaction_code: '🤯', reaction_name: 'Mind Blown'},
        {reaction_id: uuid.v4(), reaction_code: '😱', reaction_name: 'Shocked'},
        {reaction_id: uuid.v4(), reaction_code: '🤬', reaction_name: 'Angry'},
        {reaction_id: uuid.v4(), reaction_code: '😢', reaction_name: 'Sad'},
        {reaction_id: uuid.v4(), reaction_code: '🎉', reaction_name: 'Party'},
        {reaction_id: uuid.v4(), reaction_code: '🤩', reaction_name: 'Excited'},
        {reaction_id: uuid.v4(), reaction_code: '🤮', reaction_name: 'Disgusted'},
        {reaction_id: uuid.v4(), reaction_code: '💩', reaction_name: 'Poop'},
        {reaction_id: uuid.v4(), reaction_code: '🙏', reaction_name: 'Pray'},
        {reaction_id: uuid.v4(), reaction_code: '👌', reaction_name: 'Perfect'},
        {reaction_id: uuid.v4(), reaction_code: '🤡', reaction_name: 'Clown'},
        {reaction_id: uuid.v4(), reaction_code: '💊', reaction_name: 'Pill'},
        {reaction_id: uuid.v4(), reaction_code: '🤣️', reaction_name: 'Laugh Hard'},
        {reaction_id: uuid.v4(), reaction_code: '😭', reaction_name: 'Crying'},
        {reaction_id: uuid.v4(), reaction_code: '😘', reaction_name: 'Kiss'},
        {reaction_id: uuid.v4(), reaction_code: '💪', reaction_name: 'Strong'},
        {reaction_id: uuid.v4(), reaction_code: '😍', reaction_name: 'Heart Eyes'},
        {reaction_id: uuid.v4(), reaction_code: '💯', reaction_name: '100%'},
        {reaction_id: uuid.v4(), reaction_code: '🎉', reaction_name: 'Celebration'},
        {reaction_id: uuid.v4(), reaction_code: '😁', reaction_name: 'Smile'},
        {reaction_id: uuid.v4(), reaction_code: '😡', reaction_name: 'Furious'},
        {reaction_id: uuid.v4(), reaction_code: '🥺', reaction_name: 'Begging'},
        {reaction_id: uuid.v4(), reaction_code: '💋', reaction_name: 'Kiss Mark'},
        {reaction_id: uuid.v4(), reaction_code: '🤦', reaction_name: 'Facepalm'},
        {reaction_id: uuid.v4(), reaction_code: '💀', reaction_name: 'Dead'},
        {reaction_id: uuid.v4(), reaction_code: '😴', reaction_name: 'Sleeping'},
        {reaction_id: uuid.v4(), reaction_code: '😐', reaction_name: 'Neutral'},
        {reaction_id: uuid.v4(), reaction_code: '😇', reaction_name: 'Angel'},
        {reaction_id: uuid.v4(), reaction_code: '🖕', reaction_name: 'Middle Finger'},
        {reaction_id: uuid.v4(), reaction_code: '🙈', reaction_name: 'See-No-Evil'},
        {reaction_id: uuid.v4(), reaction_code: '💅', reaction_name: 'Nails'},
        {reaction_id: uuid.v4(), reaction_code: '🆒', reaction_name: 'Cool'}
    ])

    process.exit()
}

runSeeder().catch((error) => {
    console.error('Seeding errors: ', error)
    process.exit(1)
})