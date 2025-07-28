import React, { Dispatch, FC, memo, RefObject, SetStateAction, useMemo } from 'react';
import useSubscribeToMessenger from '@features/MessengerInput/lib/hooks/useSubscribeToMessenger';
import InputBlock from '@features/MessengerInput/ui/InputBlock/InputBlock';
import { checkRights } from '@entities/Member';
import { AdaptMessengerSchema } from '@entities/Messenger';
import { useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import { SubscribeButton } from '@shared/ui';

interface IMessengerInputProps {
    reply: MessageSchema | null;
    setReply: Dispatch<SetStateAction<MessageSchema | null>>;
    messenger: AdaptMessengerSchema;
    messagesList: MessageSchema[];
    socketRef: RefObject<WebSocket | null>;
}

const MessengerInput: FC<IMessengerInputProps> = memo(
    ({ reply, setReply, messenger, messagesList, socketRef }) => {
        const userId = useAppSelector(state => state.user.userId);
        const { buttonState, subscribeToMessenger } = useSubscribeToMessenger(
            messenger,
            messagesList,
        );

        const members = useMemo(() => {
            if (messenger.type === 'chat') return [messenger.id, userId];
            return messenger.members?.map(({ user }) => user.user_id) ?? [];
        }, [messenger.id, messenger.members, messenger.type, userId]);

        if (typeof buttonState !== 'boolean') {
            return null;
        }

        if (messenger.type === 'channel' && !checkRights(messenger.members!, userId)) {
            return null;
        }

        if (!buttonState) {
            return (
                <SubscribeButton onClickFoo={subscribeToMessenger}>
                    {messenger.type === 'chat' ? 'Start conversation' : 'Subscribe'}
                </SubscribeButton>
            );
        }

        return (
            <InputBlock setReply={setReply} reply={reply} socketRef={socketRef} members={members} />
        );
    },
);

MessengerInput.displayName = 'MessengerInput';

export default MessengerInput;
