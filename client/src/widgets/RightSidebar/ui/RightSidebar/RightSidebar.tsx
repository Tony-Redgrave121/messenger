import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { HiOutlinePencil, HiOutlineXMark, HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import InfoList from '@widgets/RightSidebar/ui/InfoList/InfoList';
import { EditMessenger } from '@features/EditMessenger';
import { ImageBlock } from '@features/ImageBlock';
import { checkRights, MembersList } from '@entities/Member';
import { setSidebarRight, AdaptMessengerSchema } from '@entities/Messenger';
import { useAppSelector, getDate, useAppDispatch, useLoadBlob } from '@shared/lib';
import { DefaultButton, Caption, Sidebar, TopBar } from '@shared/ui';
import './right-sidebar.animation.css';

interface IRightSidebarProps {
    entity: AdaptMessengerSchema;
    setEntity: Dispatch<SetStateAction<AdaptMessengerSchema>>;
}

const RightSidebar: FC<IRightSidebarProps> = ({ entity, setEntity }) => {
    const [editMessenger, setEditMessenger] = useState(false);
    const refRightSidebar = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user_id = useAppSelector(state => state.user.userId);
    const sidebarRight = useAppSelector(state => state.sidebar.sidebarRight);

    const { image } = useLoadBlob(
        entity.image
            ? `${entity.type !== 'chat' ? 'messengers' : 'users'}/${entity.id}/${entity.image}`
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
                <InfoList entity={entity} />
                <Caption />
                {entity?.members && entity.type === 'group' && (
                    <div>
                        <MembersList
                            text="Members"
                            members={entity.members.flatMap(member => member.user)}
                            dropList={MembersDropDown}
                        />
                    </div>
                )}
                <Caption />
                <EditMessenger
                    state={editMessenger}
                    setState={setEditMessenger}
                    setEntity={setEntity}
                />
            </Sidebar>
        </CSSTransition>
    );
};

export default RightSidebar;
