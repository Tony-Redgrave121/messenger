import {FC, RefObject, useRef, useState} from 'react'
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell
} from "react-icons/hi2"
import style from './style.module.css'
import './animation.css'
import {Buttons} from '@components/buttons'
import {SidebarContainer} from "../"
import {CSSTransition} from 'react-transition-group'
import {IMessengerResponse} from "@appTypes";
import useLoadBlob from "@hooks/useLoadBlob";
import {ImageBlock} from "@components/sidebar";
import {TopBar} from "../";
import EditMessenger from "@components/sidebar/rightSidebar/editMessenger/EditMessenger";

interface IRightSidebar {
    entity: IMessengerResponse,
    ref: RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: (state: boolean) => void
}

const RightSidebar: FC<IRightSidebar> = ({entity, ref, state, setState}) => {
    const [notification, setNotification] = useState(false)
    const {image} = useLoadBlob(entity.messenger_image ? `messengers/${entity.messenger_id}/${entity.messenger_image}` : '')

    const [editMessenger, setEditMessenger] = useState({
        state: false,
        mounted: false
    })
    const refEditMessenger = useRef<HTMLDivElement>(null)

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
                    <p>{entity.messenger_type} info</p>
                    <Buttons.DefaultButton foo={() => setEditMessenger({
                        state: true,
                        mounted: true
                    })}>
                        <HiOutlinePencil/>
                    </Buttons.DefaultButton>
                </TopBar>
                <ImageBlock image={image} info={{
                    name: entity.messenger_name,
                    type: entity.messenger_type
                }}/>
                <ul className={style.InfoList}>
                    {entity.messenger_desc &&
                        <li>
                            <Buttons.SettingButton foo={() => window.navigator.clipboard.writeText(entity.messenger_desc!)} text={entity.messenger_desc} desc={'Bio'}>
                                <HiOutlineExclamationCircle/>
                            </Buttons.SettingButton>
                        </li>
                    }
                    <li>
                        <Buttons.SettingButton foo={() => window.navigator.clipboard.writeText(`http://localhost:3000/${entity.messenger_type}/${entity.messenger_id}`)} text={entity.messenger_id} desc={'Link'}>
                            <HiOutlinePaperClip/>
                        </Buttons.SettingButton>
                    </li>
                    <li>
                        <Buttons.SwitchSettingButton text={'Notifications'} foo={() => setNotification(!notification)} state={notification}>
                            <HiOutlineBell/>
                        </Buttons.SwitchSettingButton>
                    </li>
                </ul>
                {editMessenger.mounted && <EditMessenger setState={setEditMessenger} refSidebar={refEditMessenger}/>}
            </SidebarContainer>
        </CSSTransition>
    )
}

export default RightSidebar