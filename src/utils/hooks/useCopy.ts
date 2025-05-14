import {setPopupMessageChildren, setPopupMessageState} from "@store/reducers/appReducer";
import {useAppDispatch} from "@hooks/useRedux";

const useCopy = () => {
    const dispatch = useAppDispatch()

    const handleCopy = async (toCopy: string, popupMessage: string) => {
        await window.navigator.clipboard.writeText(toCopy)
        dispatch(setPopupMessageState(true))
        dispatch(setPopupMessageChildren(popupMessage))
    }

    return {
        handleCopy
    }
}

export default useCopy