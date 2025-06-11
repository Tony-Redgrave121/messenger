import {FC, memo, useState} from 'react'
import style from './style.module.css'
import '../animation.css'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {Buttons} from "@components/buttons"
import {IAdaptMessenger} from "@appTypes";
import SearchMessage from "../searchMessage/SearchMessage";
import {useNavigate} from "react-router-dom";
import {setWrapperState} from "@store/reducers/appReducer";
import {useAppDispatch} from "@hooks/useRedux";

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