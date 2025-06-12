import {Dispatch, FC, RefObject, SetStateAction, useRef, useState} from 'react'
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell,
    HiOutlineChatBubbleLeft
} from "react-icons/hi2"
import style from './style.module.css'
import './animation.css'
import {Buttons} from '@components/buttons'
import {SidebarContainer} from "../"
import {CSSTransition} from 'react-transition-group'
import {IAdaptMessenger} from "@appTypes";
import useLoadBlob from "@hooks/useLoadBlob";
import {ImageBlock} from "@components/sidebar";
import {TopBar} from "../";
import EditMessenger from "@components/sidebar/rightSidebar/editMessenger/EditMessenger";
import useCopy from "@utils/hooks/useCopy";
import Caption from "@components/caption/Caption";
import MembersList from "@components/sidebar/rightSidebar/editMessenger/editMembers/membersList/MembersList";
import {useNavigate} from "react-router-dom";
import {getDate} from "@utils/logic/getDate";
import checkRights from "@utils/logic/checkRights";
import {useAppSelector} from "@hooks/useRedux";

interface IRightSidebar {
    entity: IAdaptMessenger,
    setEntity: Dispatch<SetStateAction<IAdaptMessenger>>,
    ref: RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: Dispatch<SetStateAction<boolean>>
}

const RightSidebar: FC<IRightSidebar> = (
    {
        entity,
        setEntity,
        ref,
        state,
        setState
    }
) => {
    const refEditMessenger = useRef<HTMLDivElement>(null)
    const [notification, setNotification] = useState(true)
    const {handleCopy} = useCopy()

    const user_id = useAppSelector(state => state.user.userId)
    const {image} = useLoadBlob(entity.image ? `${entity.type !== "chat" ? "messengers" : "users"}/${entity.id}/${entity.image}` : '')

    const [editMessenger, setEditMessenger] = useState({
        state: false,
        mounted: false
    })

    const navigate = useNavigate()

    const MembersDropDown = (user_id: string) => [
        {
            liChildren: <HiOutlineChatBubbleLeft/>,
            liText: 'Send Message',
            liFoo: () => {
                setState(false)
                setTimeout(() => navigate(`/chat/${user_id}`), 300)
            }
        }
    ]

    return (
        <CSSTransition
            in={state}
            nodeRef={ref}
            timeout={300}
            classNames='right-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['RightSidebarContainer']} ref={ref}>
                <TopBar>
                    <Buttons.DefaultButton foo={() => setState(false)}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <p>{entity.type} info</p>
                    {(entity.members && checkRights(entity.members, user_id)) &&
                        <Buttons.DefaultButton foo={() => setEditMessenger({
                            state: true,
                            mounted: true
                        })}>
                            <HiOutlinePencil/>
                        </Buttons.DefaultButton>
                    }
                </TopBar>
                <ImageBlock image={image} info={{
                    name: entity.name,
                    type: entity.type !== 'chat' ? `${entity.members_count} subscribers` : getDate(entity.last_seen!)
                }}/>
                <ul className={style.InfoList}>
                    {entity.desc &&
                        <li>
                            <Buttons.SettingButton
                                foo={() => handleCopy(entity.desc!, 'Info copied to clipboard')}
                                text={entity.desc}
                                desc={'Info'}
                            >
                                <HiOutlineExclamationCircle/>
                            </Buttons.SettingButton>
                        </li>
                    }
                    <li>
                        <Buttons.SettingButton
                            foo={() => handleCopy(`http://localhost:3000/${entity.type}/${entity.id}`, 'Link copied to clipboard')}
                            text={entity.id}
                            desc={'Link'}
                        >
                            <HiOutlinePaperClip/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SwitchSettingButton
                            text={'Notifications'}
                            foo={() => setNotification(!notification)}
                            state={notification}
                        >
                            <HiOutlineBell/>
                        </Buttons.SwitchSettingButton>
                    </li>
                </ul>
                <Caption/>
                <div>
                    {(entity?.members && entity.type === "group") &&
                        <MembersList
                            text='Members'
                            members={entity.members.flatMap(member => member.user)}
                            dropList={MembersDropDown}
                        />
                    }
                </div>
                <Caption/>
                {editMessenger.mounted &&
                    <EditMessenger
                        setState={setEditMessenger}
                        refSidebar={refEditMessenger}
                        setEntity={setEntity}
                    />
                }
            </SidebarContainer>
        </CSSTransition>
    )
}

export default RightSidebar