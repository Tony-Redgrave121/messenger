import {Dispatch, FC, memo, SetStateAction, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {IAdaptMessenger, IMessagesResponse} from "@appTypes";
import SearchMessage from "../searchMessage/SearchMessage";
import {useNavigate} from "react-router-dom";

interface ICommentsHeader {
    comments_count?: number,
    messenger: IAdaptMessenger,
    setCommentsList: Dispatch<SetStateAction<IMessagesResponse[]>>,
}

const CommentsHeader: FC<ICommentsHeader> = memo(({comments_count, messenger, setCommentsList}) => {
    const [inputState, setInputState] = useState(false)
    const navigate = useNavigate()

    const handleClose = () => {
        let timer: NodeJS.Timeout | null

        navigate(`/channel/${messenger.id}`)

        timer = setTimeout(() => setCommentsList([]), 300)

        return () => {
            timer && clearTimeout(timer)
        }
    }

    return (
        <header className={style.ChatHeader}>
            <Buttons.DefaultButton foo={handleClose}>
                <HiOutlineArrowLeft/>
            </Buttons.DefaultButton>
            <p>{comments_count} Comments</p>
            <SearchMessage
                messenger={messenger}
                state={inputState}
                setState={setInputState}
            />
            <span>
                <Buttons.DefaultButton foo={() => setInputState(!inputState)}>
                    {inputState ? <HiOutlineXMark/> : <HiOutlineMagnifyingGlass/>}
                </Buttons.DefaultButton>
            </span>
        </header>
    )
})

export default CommentsHeader