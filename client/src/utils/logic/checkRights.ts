import {IMember} from "@appTypes"
import isMember from "@utils/logic/isMember";

const checkRights = (members: IMember[], user_id: string) => {
    const myMember = isMember(members, user_id)
    return myMember?.member_status === "moderator"
}

export default checkRights