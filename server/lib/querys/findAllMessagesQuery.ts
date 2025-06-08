import models from "../../model/models";

const findAllMessagesQuery = {
    include: [
        {
            model: models.message,
            as: 'comments',
            attributes: [],
            required: false
        },
        {
            model: models.message_file,
            attributes: ['message_file_id', 'message_file_name', 'message_file_size', 'message_file_path']
        },
        {
            model: models.users,
            attributes: ['user_id', 'user_name', 'user_img']
        },
        {
            model: models.message,
            as: 'reply',
            attributes: ['message_id', 'message_text'],
            include: [{model: models.users, attributes: ['user_id', 'user_name', 'user_img']}]
        }
    ],
    group: [
        'message.message_id',
        'message_files.message_file_id',
        'user.user_id',
        'reply.message_id',
        'reply->user.user_id'
    ]
}

export default findAllMessagesQuery