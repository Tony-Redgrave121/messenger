import {IMember} from "@appTypes"

const isMember = (members: IMember[], user_id: string) => {
    return members?.find(member => member.user.user_id === user_id)
}

export default isMember