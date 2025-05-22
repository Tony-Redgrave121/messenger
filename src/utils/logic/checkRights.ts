import {IMember} from "@appTypes"

const checkRights = (members: IMember[], user_id: string) => {
    const myMember = members?.find(member => member.user.user_id === user_id)
    return myMember?.member_status === "moderator"
}

export default checkRights