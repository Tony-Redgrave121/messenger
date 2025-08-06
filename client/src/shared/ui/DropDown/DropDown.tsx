import { clsx } from 'clsx';
import { Dispatch, FC, SetStateAction } from 'react';
import { CSSTransition } from 'react-transition-group';
import getStyles from '@shared/lib/GetStyles/getStyles';
import DropDownList from '@shared/types/DropDownList';
import useDropDown from '@shared/ui/DropDown/useDropDown';
import StopPropagationWrapper from '@shared/ui/StopPropagationWrapper/StopPropagationWrapper';
import style from './drop-down.module.css';
import './drop-down.animation.css';

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
                <StopPropagationWrapper>
                    <ul
                        ref={ulRef}
                        className={clsx(
                            style.DropDownContainer,
                            styles && getStyles(styles, style),
                        )}
                        style={{
                            left: position?.x,
                            top: position?.y,
                        }}
                    >
                        {list.map((item, index) => (
                            <li key={index}>
                                <button onClick={item.liFoo}>
                                    {item.liChildren}
                                    {item.liText && <p>{item.liText}</p>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </StopPropagationWrapper>
            </>
        </CSSTransition>
    );
};

export default DropDown;
