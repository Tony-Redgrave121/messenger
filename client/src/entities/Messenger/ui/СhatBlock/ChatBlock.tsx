import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { getDate, useAppSelector } from '@shared/lib';
import { LoadFile } from '@shared/ui/LoadFile';
import ChatBlockSchema from '../../model/types/ChatBlockSchema';
import style from './style.module.css';

interface IChatBlockProps {
    messenger: ChatBlockSchema;
}

const ChatBlock: FC<IChatBlockProps> = memo(({ messenger }) => {
    const { messenger_id, messenger_name, messenger_image, messenger_type, messages } = messenger;

    const notifications = useAppSelector(state => state.messenger.notifications);
    const notificationCount = notifications?.[messenger_id] ?? 0;

    const lastMessage = messages[0];
    const formattedDate = lastMessage?.message_date ? getDate(lastMessage.message_date) : '';
    const lastMessageText = lastMessage?.message_text || 'Media';

    const imagePath = messenger_image
        ? `${messenger_type !== 'chat' ? 'messengers' : 'users'}/${messenger_id}/${messenger_image}`
        : '';

    return (
        <Link to={`${messenger_type}/${messenger_id}`} className={style.ChatContainer}>
            <LoadFile imagePath={imagePath} imageTitle={messenger_name} />
            <div className={style.DescContainer}>
                <span className={style.MessengerInfo}>
                    <p>{messenger_name}</p>
                    {formattedDate && <p>{formattedDate}</p>}
                </span>
                <span className={style.MessageInfo}>
                    {lastMessage && <p>{lastMessageText}</p>}
                    {notificationCount > 0 && <b>{notificationCount}</b>}
                </span>
            </div>
        </Link>
    );
});

ChatBlock.displayName = 'ChatBlock';

export default ChatBlock;
