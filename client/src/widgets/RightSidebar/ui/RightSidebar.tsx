import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { HiOutlinePencil, HiOutlineXMark, HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import InfoList from '@widgets/RightSidebar/ui/InfoList';
import EditMessenger from '@features/EditMessenger/ui/EditMessenger';
import { ImageBlock } from '@features/ImageBlock';
import MembersList from '@entities/Member/ui/MembersList/MembersList';
import AdaptMessengerSchema from '@entities/Messenger/model/types/AdaptMessengerSchema';
import checkRights from '@entities/User/lib/CheckRights/checkRights';
import { useAppSelector, getDate } from '@shared/lib';
import useLoadBlob from '@shared/lib/hooks/useLoadBlob/useLoadBlob';
import { DefaultButton } from '@shared/ui/Button';
import { Caption } from '@shared/ui/Caption';
import { Sidebar } from '@shared/ui/Sidebar';
import { TopBar } from '@shared/ui/TopBar';
import './right-sidebar.animation.css';

interface IRightSidebarProps {
    entity: AdaptMessengerSchema;
    setEntity: Dispatch<SetStateAction<AdaptMessengerSchema>>;
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
}

const RightSidebar: FC<IRightSidebarProps> = ({ entity, setEntity, state, setState }) => {
    const [editMessenger, setEditMessenger] = useState(false);
    const refRightSidebar = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const user_id = useAppSelector(state => state.user.userId);
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
                setState(false);
                setTimeout(() => navigate(`/chat/${user_id}`), 300);
            },
        },
    ];

    return (
        <CSSTransition
            in={state}
            nodeRef={refRightSidebar}
            timeout={300}
            classNames="right-sidebar-node"
            unmountOnExit
        >
            <Sidebar styles={['RightSidebarContainer']} ref={refRightSidebar}>
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
