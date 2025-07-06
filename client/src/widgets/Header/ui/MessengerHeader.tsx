import { Dispatch, FC, memo, SetStateAction, useState } from 'react';
import style from './style.module.css';
import { LoadFile } from '@shared/ui/LoadFile';
import {
    HiOutlineMagnifyingGlass,
    HiEllipsisVertical,
    HiOutlineUserPlus,
    HiOutlineTrash,
    HiOutlineBellSlash,
    HiOutlineArrowLeft,
    HiOutlineUserMinus,
} from 'react-icons/hi2';
import { DropDown } from '@shared/ui/DropDown';
import { useAppDispatch, useAbortController, useAppSelector, getDate } from '@shared/lib';
import { clsx } from 'clsx';
import SearchMessage from '@features/SearchMessage/ui/SearchMessage';
import { useNavigate, useParams } from 'react-router-dom';
import { addContact, deleteContact } from '@entities/Contact/model/slice/contactSlice';
import { deleteMessenger } from '@entities/Messenger/lib/thunk/messengerThunk';
import { DefaultButton } from '@shared/ui/Button';
import { setSidebarLeft } from '../../LeftSidebar/model/slice/sidebarSlice';
import postContactApi from '@widgets/Header/api/postContactApi';
import deleteContactApi from '@widgets/Header/api/deleteContactApi';
import deleteChatApi from '@widgets/Header/api/deleteChatApi';
import deleteMemberApi from '@features/EditMembers/api/deleteMemberApi';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';

interface IChatHeader {
    messenger: AdaptMessengerSchema;
    setSidebarState: Dispatch<SetStateAction<boolean>>;
}

const MessengerHeader: FC<IChatHeader> = memo(({ messenger, setSidebarState }) => {
    const [settings, setSettings] = useState(false);
    const [inputState, setInputState] = useState(false);

    const sidebarLeft = useAppSelector(state => state.sidebar.sidebarLeft);
    const userId = useAppSelector(state => state.user.userId);
    const contacts = useAppSelector(state => state.contact.contacts);

    const { messengerId } = useParams();
    const { getSignal } = useAbortController();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const getHeaderDesc = () => {
        switch (messenger.type) {
            case 'chat':
                return getDate(messenger.last_seen!);
            case 'group':
                return `${messenger.members_count} members`;
            case 'channel':
                return `${messenger.members_count} subscribers`;
            default:
                const exhaustiveCheck: never = messenger.type;
                return exhaustiveCheck;
        }
    };

    const HeaderLists = {
        chat: [
            {
                liChildren: <HiOutlineBellSlash />,
                liText: 'Mute',
                liFoo: () => {},
            },
            contacts.some(el => el.user_id === messengerId)
                ? {
                      liChildren: <HiOutlineUserMinus />,
                      liText: 'Remove from contacts',
                      liFoo: async () => {
                          if (!messengerId) return;
                          const signal = getSignal();

                          try {
                              const res = await deleteContactApi(userId, messengerId, signal);

                              if (res.status === 200) dispatch(deleteContact(messengerId));
                          } catch (error) {
                              console.log(error);
                          }
                      },
                  }
                : {
                      liChildren: <HiOutlineUserPlus />,
                      liText: 'Add to contacts',
                      liFoo: async () => {
                          if (!messengerId) return;
                          const signal = getSignal();

                          try {
                              const newContact = await postContactApi(userId, messengerId, signal);

                              if (newContact.status === 200) dispatch(addContact(newContact.data));
                          } catch (error) {
                              console.log(error);
                          }
                      },
                  },
            {
                liChildren: <HiOutlineTrash />,
                liText: 'Delete Chat',
                liFoo: async () => {
                    if (!messengerId) return;
                    const signal = getSignal();

                    try {
                        const res = await deleteChatApi(userId, messengerId, signal);

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId));
                            navigate('/');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ],
        group: [
            {
                liChildren: <HiOutlineBellSlash />,
                liText: 'Mute',
                liFoo: () => {},
            },
            {
                liChildren: <HiOutlineTrash />,
                liText: 'Leave Group',
                liFoo: async () => {
                    if (!messengerId) return;
                    const signal = getSignal();

                    try {
                        const res = await deleteMemberApi(userId, messengerId, signal);

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId));
                            navigate('/');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ],
        channel: [
            {
                liChildren: <HiOutlineBellSlash />,
                liText: 'Mute',
                liFoo: () => {},
            },
            {
                liChildren: <HiOutlineTrash />,
                liText: 'Leave Channel',
                liFoo: async () => {
                    if (!messengerId) return;
                    const signal = getSignal();

                    try {
                        const res = await deleteMemberApi(userId, messengerId, signal);

                        if (res.status === 200) {
                            dispatch(deleteMessenger(messengerId));
                            navigate('/');
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ],
    };

    return (
        <header className={clsx(style.ChatHeader, style.MainHeader)}>
            <DefaultButton foo={() => dispatch(setSidebarLeft(!sidebarLeft))}>
                <HiOutlineArrowLeft />
            </DefaultButton>
            <button className={style.DeskBlock} onClick={() => setSidebarState(true)}>
                <LoadFile
                    imagePath={
                        messenger.image
                            ? `${messenger.type !== 'chat' ? 'messengers' : 'users'}/${messenger.id}/${messenger.image}`
                            : ''
                    }
                    imageTitle={messenger.name}
                    key={messenger.id}
                />
                <div>
                    <h3>{messenger.name}</h3>
                    <p>{getHeaderDesc()}</p>
                </div>
            </button>
            <SearchMessage messenger={messenger} state={inputState} setState={setInputState} />
            <span>
                <DefaultButton foo={() => setInputState(true)}>
                    <HiOutlineMagnifyingGlass />
                </DefaultButton>
                <DefaultButton foo={() => setSettings(!settings)}>
                    <HiEllipsisVertical />
                    <DropDown
                        list={HeaderLists[messenger.type]}
                        state={settings}
                        setState={setSettings}
                    />
                </DefaultButton>
            </span>
        </header>
    );
});

export default MessengerHeader;
