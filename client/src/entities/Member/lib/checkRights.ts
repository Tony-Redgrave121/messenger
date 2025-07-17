import isMember from '@entities/Member/lib/isMember';
import { MemberSchema } from '@shared/types';

const checkRights = (members: MemberSchema[], user_id: string) => {
    const myMember = isMember(members, user_id);
    return myMember?.member_status === 'moderator';
};

export default checkRights;
