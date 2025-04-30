import {ReactNode} from "react";

export default interface IDropDownList {
    liChildren: ReactNode,
    liText?: string,
    liFoo: () => void
}