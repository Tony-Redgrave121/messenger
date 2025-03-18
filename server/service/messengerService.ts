import models from "../model/models"

interface IContacts {
    user: {
        user_id: string,
        user_name: string,
        user_img: string,
        user_last_seen: string
    }
}

class MessengerService {
    async fetchContacts(id: string) {
        const contacts = await models.contacts.findAll({
            where: {owner_id: id},
            include: [{
                model: models.users,
                attributes: ['user_id', 'user_name', 'user_img', 'user_last_seen']
            }],
            attributes: []
        }) as unknown as IContacts[]

        return contacts.map(contact => contact.user)
    }
}

export default new MessengerService()