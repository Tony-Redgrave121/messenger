import React, { FC, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { getTitle } from '@shared/lib';
import { MessageSchema } from '@shared/types';

interface IOwnerLinkProps {
    messenger: AdaptMessengerSchema;
    message: MessageSchema;
}

const OwnerNameLink: FC<IOwnerLinkProps> = ({ messenger, message }) => {
    const refLink = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        getTitle(refLink, message.user.user_name, 'color');
    }, [message.user.user_name]);

    return (
        <>
            {messenger.type !== 'channel' ? (
                <Link to={`/chat/${message.user.user_id}`} ref={refLink}>
                    {message.user.user_name}
                </Link>
            ) : (
                <Link to={''} ref={refLink}>
                    {messenger.name}
                </Link>
            )}
        </>
    );
};

export default OwnerNameLink;
