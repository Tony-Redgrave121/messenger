import { FC, memo, ReactNode } from 'react';
import { getDate } from '@shared/lib';
import { ContactSchema } from '@shared/types';
import { LoadFile } from '@shared/ui';
import style from './contact.module.css';

interface IContactProps {
    contact: ContactSchema;
    children?: ReactNode;
}

const Contact: FC<IContactProps> = memo(({ contact, children }) => {
    return (
        <div className={style.ContactBlock}>
            {children}
            <span>
                <LoadFile
                    imagePath={
                        contact.user_img ? `users/${contact.user_id}/${contact.user_img}` : ''
                    }
                    imageTitle={contact.user_name}
                />
            </span>
            <div className={style.ContactInfo}>
                <h4>{contact.user_name}</h4>
                <p>{getDate(contact.user_last_seen, true)}</p>
            </div>
        </div>
    );
});

Contact.displayName = 'Contact';

export default Contact;
