import React, {useEffect} from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"
import {IDropDownList} from "@appTypes";

interface IDropDown {
    list: IDropDownList[],
    state: boolean,
    setState: ((state: boolean) => void),
    styles?: Array<string>,
    position?: {
        x: number,
        y: number
    }
}

const DropDown: React.FC<IDropDown> = ({list, state, setState, styles, position}) => {
    const refUl = React.useRef<HTMLUListElement>(null)

    useEffect(() => {
        const curr = refUl.current

        if (curr) {
            curr.addEventListener('mouseleave', () => setState(!state))
            return curr.removeEventListener('mouseleave', () => setState(!state))
        }
    }, [setState, state])

    return (
        <CSSTransition
            in={state}
            nodeRef={refUl}
            timeout={300}
            classNames='drop-down-node'
            unmountOnExit
        >
            <ul className={`${style.DropDownContainer} ${styles && styles.map(name => style[name]).join(' ')}`} ref={refUl} onClick={(event) => event.stopPropagation()}
                style={{
                    left: position?.x,
                    top: position?.y,
                }}>
                {
                    list.map((item, index) =>
                        <li key={index} onClick={item.liFoo}>
                            {item.liChildren}
                            {item.liText && <p>{item.liText}</p>}
                        </li>
                    )
                }
            </ul>
        </CSSTransition>
    )
}

export default DropDown