import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import {
    HiOutlineArrowUturnLeft,
    HiOutlineDocumentDuplicate,
    HiOutlineFire,
    HiOutlineFlag,
    HiOutlineTrash,
} from 'react-icons/hi2';
import { useParams } from 'react-router-dom';
import deleteMessageApi from '@features/Message/api/deleteMessageApi';
import { useMessageContext } from '@features/Message/lib/hooks/useMessageContext';
import { checkRights } from '@entities/Member';
import { useCopy } from '@entities/Message';
import { useAppSelector } from '@shared/lib';
import { MessageSchema } from '@shared/types';
import { DropDown } from '@shared/ui';

interface IDropDownMessageProps {
    message: MessageSchema;
    position: { x: number; y: number };
    contextMenu: boolean;
    setContextMenu: Dispatch<SetStateAction<boolean>>;
    setReactionMenu: Dispatch<SetStateAction<boolean>>;
}

const DropDownMessage: FC<IDropDownMessageProps> = ({
    message,
    position,
    contextMenu,
    setContextMenu,
    setReactionMenu,
}) => {
    const { messengerId, postId } = useParams();
    const { handleCopy } = useCopy();

    const userId = useAppSelector(state => state.user.userId);
    const { setReply, socketRef, messenger, reactions } = useMessageContext();

    const handleDelete = useCallback(async () => {
        if (!messengerId) return;
        const messageDelete = await deleteMessageApi(message.message_id);

        if (messageDelete && socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    messenger_id: `${messengerId}${postId ? `/${postId}` : ''}`,
                    user_id: userId,
                    method: 'REMOVE_MESSAGE',
                    data: messageDelete.data,
                }),
            );
        }
    }, [messengerId, postId, message.message_id, socketRef, userId]);

    const dropDownOptions = {
        react: {
            liChildren: <HiOutlineFire />,
            liText: 'Reactions',
            liFoo: () => {
                setReactionMenu(true);
                setContextMenu(false);
            },
        },
        copy: {
            liChildren: <HiOutlineDocumentDuplicate />,
            liText: 'Copy',
            liFoo: () => {
                handleCopy(message?.message_text || '', 'Text copied to clipboard');
                setContextMenu(false);
            },
        },
        reply: {
            liChildren: <HiOutlineArrowUturnLeft />,
            liText: 'Reply',
            liFoo: () => {
                setReply(message);
                setContextMenu(false);
            },
        },
        delete: {
            liChildren: <HiOutlineTrash />,
            liText: 'Delete',
            liFoo: () => {
                handleDelete().catch(e => console.error(e));
                setContextMenu(false);
            },
        },
        report: {
            liChildren: <HiOutlineFlag />,
            liText: 'Report',
            liFoo: () => {
                setContextMenu(false);
            },
        },
    };

    const handleDropDown = useCallback(() => {
        let list = [];

        const baseOptions = [dropDownOptions.copy];
        if (reactions) baseOptions.push(dropDownOptions.react);

        switch (messenger.type) {
            case 'chat':
                if (message.user_id === userId)
                    list = [...baseOptions, dropDownOptions.reply, dropDownOptions.delete];
                else list = [...baseOptions, dropDownOptions.reply];
                break;
            case 'group':
                if (message.user_id === userId || checkRights(messenger.members!, userId))
                    list = [...baseOptions, dropDownOptions.reply, dropDownOptions.delete];
                else list = [...baseOptions, dropDownOptions.reply];
                break;
            case 'channel':
                if (checkRights(messenger.members!, userId))
                    list = [...baseOptions, dropDownOptions.report, dropDownOptions.delete];
                else list = [...baseOptions, dropDownOptions.report];
                break;
        }

        return list;
    }, [dropDownOptions, message, reactions, userId]);

    const dropDownList = handleDropDown();

    return (
        <DropDown
            list={dropDownList}
            state={contextMenu}
            setState={setContextMenu}
            position={position}
        />
    );
};

export default DropDownMessage;
