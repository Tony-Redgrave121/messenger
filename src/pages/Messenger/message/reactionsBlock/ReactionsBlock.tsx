import React, {FC, RefObject} from 'react'
import style from "./style.module.css"
import {IMessagesResponse} from "@appTypes"
import {clsx} from "clsx";
import useReaction from "@utils/hooks/useReaction";
import {useAppSelector} from "@hooks/useRedux";

interface IReactionsBlockProps {
    message: IMessagesResponse,
    socketRef: RefObject<WebSocket | null>
}

const ReactionsBlock: FC<IReactionsBlockProps> = ({message, socketRef}) => {
    const {reactionOnClick} = useReaction()
    const userId = useAppSelector(state => state.user.userId)

    return (
        <ul className={style.ReactionsBlock}>
            {message.reactions!.map(reaction => (
                <li key={reaction.reaction.reaction_id}>
                    <button className={clsx(reaction.users_ids.includes(userId) && style.OwnerReaction)} onClick={()=> reactionOnClick(message, reaction.reaction, socketRef)}>
                        <span>{reaction.reaction.reaction_code}</span> {reaction.reaction_count}
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default ReactionsBlock