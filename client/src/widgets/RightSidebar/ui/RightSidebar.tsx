import { Dispatch, FC, RefObject, SetStateAction, useRef, useState } from 'react';
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell,
    HiOutlineChatBubbleLeft,
} from 'react-icons/hi2';
import style from './style.module.css';
import './animation.css';
import { CSSTransition } from 'react-transition-group';
import useLoadBlob from '@shared/lib/hooks/useLoadBlob/useLoadBlob';
import { ImageBlock } from '@features/ImageBlock';
import EditMessenger from '@features/EditMessenger/ui/EditMessenger';
import useCopy from '@entities/Message/lib/hooks/useCopy';
import { Caption } from '@shared/ui/Caption';
import MembersList from '@entities/Member/ui/MembersList/MembersList';
import { useNavigate } from 'react-router-dom';
import checkRights from '@entities/User/lib/CheckRights/checkRights';
import { useAppSelector, getDate } from '@shared/lib';
import { DefaultButton, SettingButton, SwitchSettingButton } from '@shared/ui/Button';
import { TopBar } from '@shared/ui/TopBar';
import { Sidebar } from '@shared/ui/Sidebar';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';

interface IRightSidebar {
    entity: AdaptMessengerSchema;
    setEntity: Dispatch<SetStateAction<AdaptMessengerSchema>>;
    ref: RefObject<HTMLDivElement | null>;
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
}

const CLIENT_URL = process.env.VITE_CLIENT_URL;

const RightSidebar: FC<IRightSidebar> = ({ entity, setEntity, ref, state, setState }) => {
    const refEditMessenger = useRef<HTMLDivElement>(null);
    const [notification, setNotification] = useState(true);
    const { handleCopy } = useCopy();

    const user_id = useAppSelector(state => state.user.userId);
    const { image } = useLoadBlob(
        entity.image
            ? `${entity.type !== 'chat' ? 'messengers' : 'users'}/${entity.id}/${entity.image}`
            : '',
    );

    const [editMessenger, setEditMessenger] = useState(false);

    const navigate = useNavigate();

    const MembersDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineChatBubbleLeft />,
            liText: 'Send Message',
            liFoo: () => {
                setState(false);
                setTimeout(() => navigate(`/chat/${user_id}`), 300);
            },
        },
    ];

    return (
        <CSSTransition
            in={state}
            nodeRef={ref}
            timeout={300}
            classNames="right-sidebar-node"
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer']} ref={ref}>
                <TopBar>
                    <DefaultButton foo={() => setState(false)}>
                        <HiOutlineXMark />
                    </DefaultButton>
                    <p>{entity.type} info</p>
                    {entity.members && checkRights(entity.members, user_id) && (
                        <DefaultButton foo={() => setEditMessenger(true)}>
                            <HiOutlinePencil />
                        </DefaultButton>
                    )}
                </TopBar>
                <ImageBlock
                    image={image}
                    info={{
                        name: entity.name,
                        type:
                            entity.type !== 'chat'
                                ? `${entity.members_count} subscribers`
                                : getDate(entity.last_seen!),
                    }}
                />
                <ul className={style.InfoList}>
                    {entity.desc && (
                        <li>
                            <SettingButton
                                foo={() => handleCopy(entity.desc!, 'Info copied to clipboard')}
                                text={entity.desc}
                                desc={'Info'}
                            >
                                <HiOutlineExclamationCircle />
                            </SettingButton>
                        </li>
                    )}
                    <li>
                        <SettingButton
                            foo={() =>
                                handleCopy(
                                    `${CLIENT_URL}/${entity.type}/${entity.id}`,
                                    'Link copied to clipboard',
                                )
                            }
                            text={entity.id}
                            desc={'Link'}
                        >
                            <HiOutlinePaperClip />
                        </SettingButton>
                    </li>
                    <li>
                        <SwitchSettingButton
                            text={'Notifications'}
                            foo={() => setNotification(!notification)}
                            state={notification}
                        >
                            <HiOutlineBell />
                        </SwitchSettingButton>
                    </li>
                </ul>
                <Caption />
                <div>
                    {entity?.members && entity.type === 'group' && (
                        <MembersList
                            text="Members"
                            members={entity.members.flatMap(member => member.user)}
                            dropList={MembersDropDown}
                        />
                    )}
                </div>
                <Caption />
                <EditMessenger
                    state={editMessenger}
                    setState={setEditMessenger}
                    refSidebar={refEditMessenger}
                    setEntity={setEntity}
                />
            </Sidebar>
        </CSSTransition>
    );
};

export default RightSidebar;
