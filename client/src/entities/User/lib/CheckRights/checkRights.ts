import {MemberSchema} from "@entities/Member"
import isMember from "../IsMember/isMember";

const checkRights = (members: MemberSchema[], user_id: string) => {
    const myMember = isMember(members, user_id)
    return myMember?.member_status === "moderator"
}

export default checkRights