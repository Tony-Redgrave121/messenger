import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import {
    HiOutlineBugAnt,
    HiOutlineCog8Tooth,
    HiOutlineQuestionMarkCircle,
    HiOutlineUsers,
} from 'react-icons/hi2';
import { MessengerCreationSchema } from '@features/CreateMessenger';
import { useAppSelector } from '@shared/lib';
import { DropDown, LoadFile } from '@shared/ui';

interface ICreateMessengersListProps {
    setMessengerCreation: Dispatch<SetStateAction<MessengerCreationSchema>>;
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    setProfile: Dispatch<SetStateAction<boolean>>;
}

const UserDropDown: FC<ICreateMessengersListProps> = ({
    setMessengerCreation,
    state,
    setState,
    setProfile,
}) => {
    const { userImg, userName, userId } = useAppSelector(state => state.user);

    const list = useMemo(
        () => [
            {
                liChildren: (
                    <LoadFile
                        imagePath={userImg ? `users/${userId}/avatar/${userImg}` : ''}
                        imageTitle={userName}
                    />
                ),
                liText: userName,
                liFoo: () => setProfile(true),
            },
            {
                liChildren: <HiOutlineUsers />,
                liText: 'Contacts',
                liFoo: () =>
                    setMessengerCreation(prev => ({
                        state: !prev.state,
                        type: 'chat',
                    })),
            },
            {
                liChildren: <HiOutlineCog8Tooth />,
                liText: 'Settings',
                liFoo: () => setProfile(true),
            },
            {
                liChildren: <HiOutlineQuestionMarkCircle />,
                liText: 'CrowCaw Features',
                liFoo: () => {},
            },
            {
                liChildren: <HiOutlineBugAnt />,
                liText: 'Report Bug',
                liFoo: () => {},
            },
        ],
        [setMessengerCreation, setProfile, userId, userImg, userName],
    );

    return <DropDown list={list} state={state} setState={setState} />;
};

export default UserDropDown;
