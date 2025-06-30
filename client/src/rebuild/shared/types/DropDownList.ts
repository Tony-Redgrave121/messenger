import {ReactNode} from "react";

export default interface DropDownList {
    liChildren: ReactNode,
    liText?: string,
    liFoo?: () => void
}