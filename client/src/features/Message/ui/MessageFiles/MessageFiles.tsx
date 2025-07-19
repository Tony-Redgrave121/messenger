import React, { FC, useEffect, useState } from 'react';
import { MessageMediaBlock } from '@entities/Media';
import { DocumentBlock } from '@entities/Message';
import { MessageFileSchema, MessageSchema } from '@shared/types';
import style from './message-files.module.css';

interface IMessageFilesProps {
    message: MessageSchema;
}

const MessageFiles: FC<IMessageFilesProps> = ({ message }) => {
    const [media, setMedia] = useState<MessageFileSchema[]>([]);

    useEffect(() => {
        if (message.message_files && message.message_type === 'media') {
            setMedia(message.message_files);
        }
    }, [message.message_files, message.message_type]);

    return (
        <>
            {media.length > 0 && <MessageMediaBlock media={media} messageId={message.message_id} />}
            {message.message_files && message.message_type === 'document' && (
                <div className={style.DocumentBlock}>
                    {message.message_files.map(doc => (
                        <DocumentBlock doc={doc} key={doc.message_file_id} />
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageFiles;
