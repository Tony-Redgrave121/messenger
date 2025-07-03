import {Dispatch, FC, SetStateAction} from 'react'
import dropDownStyle from './drop-down.module.css'
import './drop-down.animation.css'
import {CSSTransition} from "react-transition-group"
import {getStyles} from "../../lib";
import {clsx} from "clsx";
import useDropDown from "./useDropDown";
import {DropDownList} from "../../types";

interface IDropDownProps {
    list: DropDownList[],
    state: boolean,
    setState: Dispatch<SetStateAction<boolean>>,
    styles?: Array<string>,
    position?: {
        x: number,
        y: number
    }
}

const DropDown: FC<IDropDownProps> = ({list, state, setState, styles, position}) => {
    const {ulRef, overlayRef} = useDropDown(state, setState)

    return (
        <CSSTransition
            in={state}
            nodeRef={ulRef}
            timeout={300}
            classNames='drop-down-node'
            unmountOnExit
        >
            <>
                <div className={dropDownStyle.DropDownOverlay} ref={overlayRef}/>
                <ul
                    ref={ulRef}
                    className={clsx(dropDownStyle.DropDownContainer, styles && getStyles(styles, dropDownStyle))}
                    onClick={(event) => event.stopPropagation()}
                    style={{
                        left: position?.x,
                        top: position?.y,
                    }}
                >
                    {
                        list.map((item, index) =>
                            <li key={index} onClick={item.liFoo}>
                                {item.liChildren}
                                {item.liText && <p>{item.liText}</p>}
                            </li>
                        )
                    }
                </ul>
            </>
        </CSSTransition>
    )
}

export default DropDown