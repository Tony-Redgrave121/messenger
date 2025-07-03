import {FC, memo} from 'react'
import style from './style.module.css'
import {Control, Controller} from "react-hook-form"
import {HiOutlineUserCircle} from "react-icons/hi2"

interface IFileInputProps {
    control: Control<any>,
    handleImageChange: (file: FileList | null, onChange: (value: File) => void) => void,
    picture: File | null,
    name: string
}

const FileInput: FC<IFileInputProps> = memo(({control, handleImageChange, picture, name}) => {
    return (
        <div className={style.FileInput}>
            <Controller
                control={control}
                name={name}
                render={({field: {onChange}}) =>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id={name}
                        onChange={(event) => handleImageChange(event.currentTarget.files, onChange)}
                    />
                }
            />
            <label htmlFor={name}>
                {picture ?
                    <img src={URL.createObjectURL(picture)} alt="profile"/> : <HiOutlineUserCircle/>
                }
            </label>
        </div>
    )
})

export default FileInput