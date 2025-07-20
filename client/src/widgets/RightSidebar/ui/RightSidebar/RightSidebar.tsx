import { useRef, useState } from 'react';
import { HiOutlinePencil, HiOutlineXMark, HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import InfoList from '@widgets/RightSidebar/ui/InfoList/InfoList';
import { EditMessenger, useFetchInitialData } from '@features/EditMessenger';
import { ImageBlock } from '@entities/Media';
import { checkRights, MembersList } from '@entities/Member';
import { setSidebarRight } from '@entities/Messenger';
import { useAppSelector, getDate, useAppDispatch, useLoadBlob } from '@shared/lib';
import { DefaultButton, Caption, Sidebar, TopBar } from '@shared/ui';
import './right-sidebar.animation.css';

const RightSidebar = () => {
    const [editMessenger, setEditMessenger] = useState(false);
    const refRightSidebar = useRef<HTMLDivElement>(null);

    const { messenger, setMessenger } = useFetchInitialData();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user_id = useAppSelector(state => state.user.userId);
    const sidebarRight = useAppSelector(state => state.sidebar.sidebarRight);

    const { image } = useLoadBlob(
        messenger.image
            ? `${messenger.type !== 'chat' ? 'messengers' : 'users'}/${messenger.id}/${messenger.image}`
            : '',
    );

    const MembersDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineChatBubbleLeft />,
            liText: 'Send Message',
            liFoo: () => {
                dispatch(setSidebarRight(false));
                setTimeout(() => navigate(`/chat/${user_id}`), 300);
            },
        },
    ];

    return (
        <CSSTransition
            in={sidebarRight}
            nodeRef={refRightSidebar}
            timeout={300}
            classNames="right-sidebar-node"
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer']} ref={refRightSidebar}>
                <TopBar>
                    <DefaultButton foo={() => dispatch(setSidebarRight(false))}>
                        <HiOutlineXMark />
                    </DefaultButton>
                    <p>{messenger.type} info</p>
                    {messenger.members && checkRights(messenger.members, user_id) && (
                        <DefaultButton foo={() => setEditMessenger(true)}>
                            <HiOutlinePencil />
                        </DefaultButton>
                    )}
                </TopBar>
                <ImageBlock
                    image={image}
                    info={{
                        name: messenger.name,
                        type:
                            messenger.type !== 'chat'
                                ? `${messenger.members_count} subscribers`
                                : getDate(messenger.last_seen!),
                    }}
                />
                <InfoList entity={messenger} />
                <Caption />
                {messenger?.members && messenger.type === 'group' && (
                    <div>
                        <MembersList
                            text="Members"
                            members={messenger.members.flatMap(member => member.user)}
                            dropList={MembersDropDown}
                        />
                    </div>
                )}
                <Caption />
                <EditMessenger
                    state={editMessenger}
                    setState={setEditMessenger}
                    setEntity={setMessenger}
                />
            </Sidebar>
        </CSSTransition>
    );
};

export default RightSidebar;
