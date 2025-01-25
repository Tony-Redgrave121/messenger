import React, {useEffect} from 'react'
import style from './style.module.css'
import './animation.css'
import {CSSTransition} from "react-transition-group"

interface IPopup {
    list: Array<{
        liIcon: React.ReactNode,
        liText?: string,
        liFoo: () => void
    }>,
    state: boolean,
    setState: (state: boolean) => void,
    styles?: Array<string>
}

const Popup: React.FC<IPopup> = ({list, state, setState, styles}) => {
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
            classNames='popup-node'
            unmountOnExit
        >
            <ul className={`${style.PopupContainer} ${styles && styles.map(name => style[name]).join(' ')}`} ref={refUl} onClick={(event) => event.stopPropagation()}>
                {
                    list.map((item, index) =>
                        <li key={index} onClick={item.liFoo} >
                            {item.liIcon}
                            {item.liText && <h4>{item.liText}</h4>}
                        </li>
                    )
                }
            </ul>
        </CSSTransition>
    )
}

export default Popup