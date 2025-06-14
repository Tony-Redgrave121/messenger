import models from "../model/models";
import path from "path";
import fs from "fs";

const deleteAllMessages = async (messages: Array<{message_id: string}>) => {
    const messageIds = messages.map(msg => msg.message_id)
    if (messageIds.length === 0) return

    const messageFiles = await models.message_file.findAll({
        where: {message_id: messageIds},
        attributes: ['message_file_name', 'message_file_path'],
        raw: true
    }) as unknown as {
        message_file_name: string,
        message_file_path: string,
    }[]

    for (const file of messageFiles) {
        const filePath = path.resolve(__dirname + "/../src/static/messengers", file.message_file_path, file.message_file_name)

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    return messageIds
}

export default deleteAllMessages