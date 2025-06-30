import {memo, FC} from 'react'
import style from "./style.module.css"
import {MediaTag} from "@components/media";
import {IFileObject, IMessageFile} from "@appTypes";

interface IMedia {
    media: IFileObject[]
}

interface IMessageMediaProps {
    media: IMessageFile[],
    messageId: string
}

namespace MediaBlock {
    export const MessageMedia: FC<IMessageMediaProps> = memo(({media, messageId}) => {
        return (
            <div className={style.MediaBlock}>
                <MediaTag.MessageMedia media={media[0]} key={media[0].message_file_id} messageId={messageId}/>
                <span>
                    {media.slice(1).map(media =>
                        <MediaTag.MessageMedia media={media} key={media.message_file_id} messageId={messageId}/>
                    )}
                </span>
            </div>
        )
    })

    export const InputBlock: FC<IMedia> = memo(({media}) => {
        return (
            <div className={style.MediaBlock}>
                <MediaTag.InputBlock media={media[0]} key={media[0].url}/>
                <span>
                    {media.slice(1).map(media => <MediaTag.InputBlock media={media} key={media.url}/>)}
                </span>
            </div>
        )
    })
}



export default MediaBlock