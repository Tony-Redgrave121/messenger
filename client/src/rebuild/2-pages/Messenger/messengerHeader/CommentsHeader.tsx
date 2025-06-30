import {FC, memo, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {DefaultButton} from "../../../shared/ui/Button"
import {IAdaptMessenger} from "@appTypes";
import SearchMessage from "../searchMessage/SearchMessage";
import {useNavigate} from "react-router-dom";
import {setWrapperState} from "@store/reducers/appReducer";
import {useAppDispatch} from "../../../shared/lib";

interface ICommentsHeader {
    comments_count?: number,
    messenger: IAdaptMessenger
}

const CommentsHeader: FC<ICommentsHeader> = memo(({comments_count, messenger}) => {
    const [inputState, setInputState] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleClose = () => {
        let timer: NodeJS.Timeout | null
        dispatch(setWrapperState(false))

        timer = setTimeout(() => {
            navigate(`/channel/${messenger.id}`)
            dispatch(setWrapperState(true))
        }, 300)

        return () => {
            timer && clearTimeout(timer)
        }
    }

    return (
        <header className={style.ChatHeader}>
            <DefaultButton foo={handleClose}>
                <HiOutlineArrowLeft/>
            </DefaultButton>
            <p>{comments_count} Comments</p>
            <SearchMessage
                messenger={messenger}
                state={inputState}
                setState={setInputState}
            />
            <span>
                <DefaultButton foo={() => setInputState(!inputState)}>
                    {inputState ? <HiOutlineXMark/> : <HiOutlineMagnifyingGlass/>}
                </DefaultButton>
            </span>
        </header>
    )
})

export default CommentsHeader