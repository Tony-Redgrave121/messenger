import { MemberSchema } from '@shared/types';

const isMember = (members: MemberSchema[], user_id: string) => {
    return members?.find(({ user }) => user.user_id === user_id);
};

export default isMember;
