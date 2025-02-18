import React from 'react'
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
    HiOutlineBell
} from "react-icons/hi2"
import style from './style.module.css'
import './animation.css'
import Buttons from '../../buttons/Buttons'
import SidebarContainer from "../SidebarContainer"
import {CSSTransition} from 'react-transition-group'
import IMessengerResponse from "../../../utils/types/IMessengerResponse";
import useLoadFile from "../../../utils/hooks/useLoadFile";
import LoadFile from "../../loadFile/LoadFile";

interface IRightSidebar {
    entity: IMessengerResponse,
    ref: React.RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: (state: boolean) => void
}

const RightSidebar: React.FC<IRightSidebar> = ({entity, ref, state, setState}) => {
    const [notification, setNotification] = React.useState(false)
    const {image} = useLoadFile(entity.messenger_image ? `messengers/${entity.messenger_id}/${entity.messenger_image}` : '')

    return (
        <CSSTransition
            in={state}
            nodeRef={ref}
            timeout={300}
            classNames='right-sidebar-node'
            unmountOnExit
        >
            <SidebarContainer styles={['RightSidebarContainer']} ref={ref}>
                <div className={style.TopBar}>
                    <Buttons.DefaultButton foo={() => setState(false)}>
                        <HiOutlineXMark/>
                    </Buttons.DefaultButton>
                    <h1>{entity.messenger_type} info</h1>
                    <Buttons.DefaultButton foo={() => {}}>
                        <HiOutlinePencil/>
                    </Buttons.DefaultButton>
                </div>
                {image ?
                    <div className={style.EntityImageBlock} style={{backgroundImage: `url('${image}')`}}>
                        <div className={style.TitleBlock}>
                            <h1>{entity.messenger_name}</h1>
                            <p>{entity.messenger_type}</p>
                        </div>
                    </div> :
                    <div className={style.EntityIconBlock}>
                        <LoadFile imagePath={''} imageTitle={entity.messenger_name}/>
                        <div className={style.TitleBlock}>
                            <h1>{entity.messenger_name}</h1>
                            <p>{entity.messenger_type}</p>
                        </div>
                    </div>
                }
                <ul className={style.InfoList}>
                {entity.messenger_desc &&
                        <li>
                            <div onClick={() => window.navigator.clipboard.writeText(entity.messenger_desc!)}>
                                <HiOutlineExclamationCircle/>
                                <p>{entity.messenger_desc}<small className={style.LiType}>Bio</small></p>
                            </div>
                        </li>
                    }
                    <li>
                        <div
                            onClick={() => window.navigator.clipboard.writeText(`http://localhost:3000/${entity.messenger_type}/${entity.messenger_id}`)}>
                            <HiOutlinePaperClip/>
                            <p>{entity.messenger_id} <br/><small className={style.LiType}>Link</small></p>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => setNotification(!notification)}>
                            <span>
                                <HiOutlineBell/>
                                <p>Notifications</p>
                            </span>
                            <Buttons.SwitchButton state={notification} foo={() => setNotification(!notification)}/>
                        </div>
                    </li>
                </ul>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default RightSidebar