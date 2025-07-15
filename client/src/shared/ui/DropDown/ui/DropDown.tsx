import { clsx } from 'clsx';
import { Dispatch, FC, SetStateAction } from 'react';
import './drop-down.animation.css';
import { CSSTransition } from 'react-transition-group';
import getStyles from '@shared/lib/GetStyles/getStyles';
import DropDownList from '@shared/types/DropDownList';
import useDropDown from '../lib/hooks/useDropDown';
import style from './drop-down.module.css';

interface IDropDownProps {
    list: DropDownList[];
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
    styles?: Array<string>;
    position?: {
        x: number;
        y: number;
    };
}

const DropDown: FC<IDropDownProps> = ({ list, state, setState, styles, position }) => {
    const { ulRef, overlayRef } = useDropDown(state, setState);

    return (
        <CSSTransition
            in={state}
            nodeRef={ulRef}
            timeout={300}
            classNames="drop-down-node"
            unmountOnExit
        >
            <>
                <div className={style.DropDownOverlay} ref={overlayRef} />
                <ul
                    ref={ulRef}
                    className={clsx(style.DropDownContainer, styles && getStyles(styles, style))}
                    onClick={event => event.stopPropagation()}
                    style={{
                        left: position?.x,
                        top: position?.y,
                    }}
                >
                    {list.map((item, index) => (
                        <li key={index} onClick={item.liFoo}>
                            {item.liChildren}
                            {item.liText && <p>{item.liText}</p>}
                        </li>
                    ))}
                </ul>
            </>
        </CSSTransition>
    );
};

export default DropDown;
