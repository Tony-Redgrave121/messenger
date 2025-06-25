import {FC, memo, ReactNode} from 'react'
import style from './style.module.css'
import {FieldErrors} from "react-hook-form";

interface IButton {
    children: ReactNode,
    errors: FieldErrors,
    field: string,
}

const InputForm: FC<IButton> = memo(({children, errors, field}) => {
    return (
        <div className={style.InputBlock}>
            <label htmlFor={field}/>
            {children}
            <small>
                {errors[field] && `${errors[field]!.message?.toString()}*`}
            </small>
        </div>
    )
})

export default InputForm