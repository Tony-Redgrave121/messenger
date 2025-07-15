import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { HiOutlineMegaphone, HiOutlineUser, HiOutlineUsers } from 'react-icons/hi2';
import { MessengerCreationSchema } from '@features/CreateMessenger/model/types/MessengerCreationSchema';
import { DropDown } from '@shared/ui/DropDown';

interface ICreateMessengersListProps {
    setMessengerCreation: Dispatch<SetStateAction<MessengerCreationSchema>>;
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
}

const MessengersDropDown: FC<ICreateMessengersListProps> = ({
    setMessengerCreation,
    state,
    setState,
}) => {
    const list = useMemo(
        () => [
            {
                liChildren: <HiOutlineMegaphone />,
                liText: 'New Channel',
                liFoo: () =>
                    setMessengerCreation(prev => ({
                        state: !prev.state,
                        type: 'channel',
                    })),
            },
            {
                liChildren: <HiOutlineUsers />,
                liText: 'New Group',
                liFoo: () =>
                    setMessengerCreation(prev => ({
                        state: !prev.state,
                        type: 'group',
                    })),
            },
            {
                liChildren: <HiOutlineUser />,
                liText: 'New Private Chat',
                liFoo: () =>
                    setMessengerCreation(prev => ({
                        state: !prev.state,
                        type: 'chat',
                    })),
            },
        ],
        [setMessengerCreation],
    );

    return <DropDown list={list} state={state} setState={setState} />;
};

export default MessengersDropDown;
