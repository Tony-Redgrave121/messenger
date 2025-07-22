import React, { FC, memo, ReactNode } from 'react';
import style from './contact-button.module.css';

interface IContactButtonProps {
    children?: ReactNode;
    foo?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

const ContactButton: FC<IContactButtonProps> = memo(({ children, foo }) => {
    return (
        <button className={style.ContactButton} onClick={foo}>
            {children}
        </button>
    );
});

ContactButton.displayName = 'ContactButton';

export default ContactButton;
