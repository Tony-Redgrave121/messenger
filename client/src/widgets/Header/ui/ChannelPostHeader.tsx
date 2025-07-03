import {FC, memo, useState} from 'react'
import style from './style.module.css'
import {
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineArrowLeft
} from "react-icons/hi2"
import {DefaultButton} from "@shared/ui/Button"
import {IAdaptMessenger} from "@appTypes";
import SearchMessage from "@features/SearchMessage/SearchMessage";
import {useNavigate} from "react-router-dom";
import {setWrapperState} from "../../Main/model/slice/wrapperSlice";
import {useAppDispatch} from "@shared/lib";

interface ICommentsHeader {
    commentsCount?: number,
    messenger: IAdaptMessenger
}

const ChannelPostHeader: FC<ICommentsHeader> = memo(({commentsCount, messenger}) => {
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
            <p>{commentsCount} Comments</p>
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

export default ChannelPostHeader