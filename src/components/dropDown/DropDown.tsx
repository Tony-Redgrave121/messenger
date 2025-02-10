import React, {useEffect} from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"

interface IDropDown {
    list: Array<{
        liChildren: React.ReactNode,
        liText?: string,
        liFoo: () => void
    }>,
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
                    left: position && position.x,
                    top: position && position.y,
                }}>
                {
                    list.map((item, index) =>
                        <li key={index} onClick={item.liFoo}>
                            {item.liChildren}
                            {item.liText && <h4>{item.liText}</h4>}
                        </li>
                    )
                }
            </ul>
        </CSSTransition>
    )
}

export default DropDown