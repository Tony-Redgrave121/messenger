import { clsx } from 'clsx';
import React, { FC, RefObject } from 'react';
import useReaction from '@entities/Reaction/lib/hooks/useReaction';
import { useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import style from './style.module.css';

interface ReactionSchemasBlockProps {
    message: MessageSchema;
    socketRef: RefObject<WebSocket | null>;
}

const ReactionsBlock: FC<ReactionSchemasBlockProps> = ({ message, socketRef }) => {
    const { reactionOnClick } = useReaction();
    const userId = useAppSelector(state => state.user.userId);

    return (
        <ul className={style.ReactionsBlock}>
            {message.reactions!.map(reaction => (
                <li key={reaction.reaction.reaction_id}>
                    <button
                        className={clsx(reaction.users_ids.includes(userId) && style.OwnerReaction)}
                        onClick={() => reactionOnClick(message, reaction.reaction, socketRef)}
                    >
                        <span>{reaction.reaction.reaction_code}</span> {reaction.reaction_count}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ReactionsBlock;
