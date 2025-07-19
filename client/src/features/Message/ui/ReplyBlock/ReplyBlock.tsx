import React, { FC } from 'react';
import { scrollInto } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from './reply-block.module.css';

interface IReplyBlockProps {
    message: MessageSchema;
}

const ReplyBlock: FC<IReplyBlockProps> = ({ message }) => {
    return (
        <>
            {message.reply && (
                <button
                    className={style.ReplyBlock}
                    onClick={() => scrollInto(message.reply!.message_id)}
                >
                    <p>{message.reply.user.user_name}</p>
                    <p>{message.reply.message_text}</p>
                </button>
            )}
        </>
    );
};

export default ReplyBlock;
