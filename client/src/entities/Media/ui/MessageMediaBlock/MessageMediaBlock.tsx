import React, { FC, memo } from 'react';
import MessageMedia from '@entities/Media/ui/MessageMedia/MessageMedia';
import { MessageFileSchema } from '@shared/types';
import style from './message-media-block.module.css';

interface IMessageMediaProps {
    media: MessageFileSchema[];
    messageId: string;
}

const MessageMediaBlock: FC<IMessageMediaProps> = memo(({ media, messageId }) => {
    return (
        <div className={style.MediaBlock}>
            <MessageMedia media={media[0]} key={media[0].message_file_id} messageId={messageId} />
            {media.length > 1 && (
                <span>
                    {media.slice(1).map(m => (
                        <MessageMedia media={m} key={m.message_file_id} messageId={messageId} />
                    ))}
                </span>
            )}
        </div>
    );
});

MessageMediaBlock.displayName = 'MessageMediaBlock';

export default MessageMediaBlock;
