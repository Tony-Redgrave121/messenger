import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import {
    HiOutlineBellSlash,
    HiOutlineTrash,
    HiOutlineUserMinus,
    HiOutlineUserPlus,
} from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import deleteChatApi from '@widgets/Header/api/deleteChatApi';
import addNewContact from '@widgets/Header/lib/addNewContact';
import deleteMyContact from '@widgets/Header/lib/deleteMyContact';
import { deleteMemberApi } from '@features/EditMessenger';
import { AdaptMessengerSchema, deleteMessenger } from '@entities/Messenger';
import { useAbortController, useAppDispatch, useAppSelector } from '@shared/lib';
import { DropDown } from '@shared/ui';

interface IHeaderDropDownProps {
    messenger: AdaptMessengerSchema;
    settings: boolean;
    setSettings: Dispatch<SetStateAction<boolean>>;
}

const HeaderDropDown: FC<IHeaderDropDownProps> = memo(({ messenger, settings, setSettings }) => {
    const userId = useAppSelector(state => state.user.userId);
    const contacts = useAppSelector(state => state.contact.contacts);

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const getHeaderList = () => {
        if (!messengerId) return [];
        const signal = getSignal();

        const leaveFromMessenger = async () => {
            try {
                const res = await deleteMemberApi(userId, messengerId, signal);

                if (res.status === 200) {
                    dispatch(deleteMessenger(messengerId));
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        };

        const deleteMyChat = async () => {
            try {
                const res = await deleteChatApi(userId, messengerId, signal);

                if (res.status === 200) {
                    dispatch(deleteMessenger(messengerId));
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        };

        switch (messenger.type) {
            case 'chat':
                return [
                    {
                        liChildren: <HiOutlineBellSlash />,
                        liText: 'Mute',
                        liFoo: () => {},
                    },
                    contacts.some(el => el.user_id === messengerId)
                        ? {
                              liChildren: <HiOutlineUserMinus />,
                              liText: 'Remove from contacts',
                              liFoo: () => deleteMyContact(userId, messengerId, signal, dispatch),
                          }
                        : {
                              liChildren: <HiOutlineUserPlus />,
                              liText: 'Add to contacts',
                              liFoo: () => addNewContact(userId, messengerId, signal, dispatch),
                          },
                    {
                        liChildren: <HiOutlineTrash />,
                        liText: 'Delete Chat',
                        liFoo: () => deleteMyChat(),
                    },
                ];
            case 'group':
                return [
                    {
                        liChildren: <HiOutlineBellSlash />,
                        liText: 'Mute',
                        liFoo: () => {},
                    },
                    {
                        liChildren: <HiOutlineTrash />,
                        liText: 'Leave Group',
                        liFoo: () => leaveFromMessenger(),
                    },
                ];
            case 'channel':
                return [
                    {
                        liChildren: <HiOutlineBellSlash />,
                        liText: 'Mute',
                        liFoo: () => {},
                    },
                    {
                        liChildren: <HiOutlineTrash />,
                        liText: 'Leave Channel',
                        liFoo: () => leaveFromMessenger(),
                    },
                ];
            default: {
                const exhaustiveCheck: never = messenger.type;
                return exhaustiveCheck;
            }
        }
    };

    return <DropDown list={getHeaderList()} state={settings} setState={setSettings} />;
});

HeaderDropDown.displayName = 'HeaderDropDown';

export default HeaderDropDown;
