import {Dispatch, SetStateAction} from "react";
import {IToggleState} from "@appTypes";

const closeForm = <T extends string>(key: string, setFormsState: Dispatch<SetStateAction<IToggleState<T>>>) => {
    setFormsState((prev: any) => ({
        ...prev,
        [key]: {
            ...prev[key],
            state: false
        }
    }))
}

export default closeForm