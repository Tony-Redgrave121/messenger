import React, {FC} from 'react'
import style from "./style.module.css"
import {IReaction} from "@appTypes"
import {clsx} from "clsx";

interface IReactionsBlockProps {
    reactions: {
        reaction_count: string,
        reaction: IReaction
    }[]
}

const ReactionsBlock: FC<IReactionsBlockProps> = ({reactions}) => {
    return (
        <ul className={style.ReactionsBlock}>
            {reactions.map(reaction => (
                <li key={reaction.reaction.reaction_id}>
                    <button className={clsx(reaction.reaction.is_liked_by_user && style.OwnerReaction)}>
                        <span>{reaction.reaction.reaction_code}</span> {reaction.reaction_count}
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default ReactionsBlock