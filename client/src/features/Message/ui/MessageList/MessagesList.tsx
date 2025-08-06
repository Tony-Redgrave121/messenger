import React, { FC, RefObject, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import Message from '@features/Message/ui/Message/Message';
import { MessageSchema } from '@shared/types';
import style from './message-list.module.css';

interface IMessagesListProps {
    messagesList: MessageSchema[];
    onStartReached: () => void;
    totalCount: number;
    refVirtuoso: RefObject<VirtuosoHandle | null>;
}

const MessagesList: FC<IMessagesListProps> = ({
    messagesList,
    onStartReached,
    totalCount,
    refVirtuoso,
}) => {
    const [viewedIds, setViewedIds] = useState<string[]>([]);

    return (
        <Virtuoso
            className={style.VirtuosoContainer}
            ref={refVirtuoso}
            data={messagesList}
            itemContent={(_, message) => (
                <Message
                    message={message}
                    viewedIds={viewedIds}
                    setViewedIds={setViewedIds}
                    key={message.message_id}
                />
            )}
            initialTopMostItemIndex={messagesList?.length}
            followOutput="auto"
            atTopStateChange={atTop => {
                if (atTop) onStartReached();
            }}
            firstItemIndex={totalCount - messagesList?.length}
            aria-live="polite"
        />
    );
};

export default MessagesList;
