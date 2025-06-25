import {Dispatch, SetStateAction} from "react";
import {IToggleState} from "@appTypes";

const openForm = <T extends string>(key: string, setFormsState: Dispatch<SetStateAction<IToggleState<T>>>) => {
    setFormsState(prev => ({
        ...prev,
        [key]: { state: true, mounted: true }
    }))
}

export default openForm