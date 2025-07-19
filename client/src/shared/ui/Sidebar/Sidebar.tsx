import { clsx } from 'clsx';
import { FC, ReactNode, RefObject } from 'react';
import getStyles from '@shared/lib/GetStyles/getStyles';
import style from './sidebar.module.css';

interface ISidebarContainer {
    ref?: RefObject<HTMLDivElement | null>;
    children: ReactNode;
    styles?: Array<string>;
}

const Sidebar: FC<ISidebarContainer> = ({ children, styles, ref }) => {
    return (
        <aside
            className={clsx(style.SidebarContainer, styles && getStyles(styles, style))}
            ref={ref}
        >
            <div className={style.Wrapper}>{children}</div>
        </aside>
    );
};

export default Sidebar;
