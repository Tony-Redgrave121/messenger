import {Dispatch, SetStateAction} from "react";

const useEditMessenger = (
    setPopup: Dispatch<SetStateAction<boolean>>,
) => {
    const handleCancel = () => {
        setPopup(false)
        setTimeout(() => setPopup(false), 300)
    }



    return {
        handleCancel,

    }
}

export default useEditMessenger