import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { MessageSchema } from '@shared/types';
import { LoadFile } from '@shared/ui';
import style from './owner-link.module.css';

interface IOwnerLinkProps {
    isOwner: boolean;
    messenger: AdaptMessengerSchema;
    message: MessageSchema;
}

const OwnerImageLink: FC<IOwnerLinkProps> = ({ isOwner, messenger, message }) => {
    return (
        <>
            {!isOwner && (
                <Link
                    className={style.UserAvatarLink}
                    to={messenger.type !== 'channel' ? `/chat/${message.user.user_id}` : ''}
                >
                    {messenger.type === 'channel' ? (
                        <LoadFile
                            imagePath={
                                messenger.image && `messengers/${messenger.id}/${messenger.image}`
                            }
                            imageTitle={messenger.name}
                        />
                    ) : (
                        <LoadFile
                            imagePath={
                                message.user.user_img &&
                                `users/${message.user.user_id}/${message.user.user_img}`
                            }
                            imageTitle={message.user.user_name}
                        />
                    )}
                </Link>
            )}
        </>
    );
};

export default OwnerImageLink;
