import React, { Dispatch, FC, SetStateAction } from 'react';
import { useMessageContext } from '@features/Message/lib/hooks/useMessageContext';
import { useReaction } from '@entities/Reaction';
import { MessageSchema } from '@shared/types';
import { DropDown } from '@shared/ui';

interface IDropDownReactionsProps {
    message: MessageSchema;
    position: { x: number; y: number };
    setContextMenu: Dispatch<SetStateAction<boolean>>;
    reactionMenu: boolean;
    setReactionMenu: Dispatch<SetStateAction<boolean>>;
}

const DropDownReactions: FC<IDropDownReactionsProps> = ({
    message,
    position,
    setContextMenu,
    reactionMenu,
    setReactionMenu,
}) => {
    const { reactionOnClick } = useReaction();
    const { socketRef, reactions } = useMessageContext();

    const reactionList = reactions?.map(reaction => ({
        liChildren: reaction.reaction_code,
        liFoo: async () => {
            await reactionOnClick(message, reaction, socketRef);

            setContextMenu(false);
            setReactionMenu(false);
        },
    }));

    return (
        <>
            {reactionList && (
                <DropDown
                    list={reactionList}
                    state={reactionMenu}
                    setState={setReactionMenu}
                    position={position}
                    styles={['EmojiContainer']}
                />
            )}
        </>
    );
};

export default DropDownReactions;
