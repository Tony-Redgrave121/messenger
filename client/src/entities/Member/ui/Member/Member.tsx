import React, { FC, memo, ReactNode, RefObject, useState } from 'react';
import { useAppSelector, getDate, handleContextMenu } from '@shared/lib';
import { ContactSchema, DropDownList } from '@shared/types';
import { DropDown, LoadFile } from '@shared/ui';
import style from './member.module.css';

interface IContactsProps {
    refContainer: RefObject<HTMLDivElement | null>;
    contact: ContactSchema;
    children?: ReactNode;
    dropList: DropDownList[];
}

const Member: FC<IContactsProps> = memo(({ refContainer, contact, children, dropList }) => {
    const [contextMenu, setContextMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const user_id = useAppSelector(state => state.user.userId);

    return (
        <div
            className={style.Member}
            onContextMenu={event =>
                user_id !== contact.user_id &&
                handleContextMenu({
                    refContainer,
                    event,
                    setPosition,
                    setContextMenu,
                })
            }
        >
            {children}
            <span>
                <LoadFile
                    imagePath={
                        contact.user_img
                            ? `users/${contact.user_id}/avatar/${contact.user_img}`
                            : ''
                    }
                    imageTitle={contact.user_name}
                />
            </span>
            <div className={style.MemberInfo}>
                <h4>{contact.user_name}</h4>
                <p>{getDate(contact.user_last_seen, true)}</p>
            </div>
            <DropDown
                list={dropList}
                state={contextMenu}
                setState={setContextMenu}
                position={position}
            />
        </div>
    );
});

Member.displayName = 'Member';

export default Member;
