import React from 'react'
import {
    HiOutlinePencil,
    HiOutlineXMark,
    HiOutlineExclamationCircle,
    HiOutlinePaperClip,
} from "react-icons/hi2"
import style from './style.module.css'
import './animation.css'
import Buttons from '../../buttons/Buttons'
import SidebarContainer from "../SidebarContainer"
import unImage from './un-image.jpg'
import {CSSTransition} from 'react-transition-group'

interface IRightSidebar {
    entity: {
        entityImage: string,
        entityType: string,
        entityTitle: string,
        entityLink: string,
        entityDesc: string,
        entityBio: string
    },
    ref: React.RefObject<HTMLDivElement | null>,
    state: boolean,
    setState: (state: boolean) => void
}

const RightSidebar: React.FC<IRightSidebar> = ({entity, ref, state, setState}) => {
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
                    <h1>{entity.entityType} Info</h1>
                    <Buttons.DefaultButton foo={() => {}}>
                        <HiOutlinePencil/>
                    </Buttons.DefaultButton>
                </div>
                <div className={style.EntityImageBlock} style={{backgroundImage: `url('${unImage}')`}}>
                    <div>
                        <h1>{entity.entityTitle}</h1>
                        <p>{entity.entityDesc}</p>
                    </div>
                </div>
                <ul className={style.InfoList}>
                    <li>
                        <HiOutlineExclamationCircle/>
                        <p>{entity.entityBio} <p className={style.LiType}>Bio</p></p>
                    </li>
                    <li>
                        <HiOutlinePaperClip/>
                        <p>{entity.entityLink} <p className={style.LiType}>Link</p></p>
                    </li>
                </ul>
            </SidebarContainer>
        </CSSTransition>
    )
}

export default RightSidebar