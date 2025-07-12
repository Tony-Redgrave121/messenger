import { FC, memo, ReactNode } from 'react';
import style from './caption.module.css';

interface ICaptionProps {
    children?: ReactNode;
}

const Caption: FC<ICaptionProps> = memo(({ children }) => {
    return <div className={style.CaptionBlock}>{children && <p>{children}</p>}</div>;
});

Caption.displayName = 'Caption';

export default Caption;
