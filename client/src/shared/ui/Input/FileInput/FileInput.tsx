import { Control, Controller, FieldValue, FieldValues, Path } from 'react-hook-form';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import style from './style.module.css';

interface IFileInputProps<TField extends FieldValues, TName extends Path<FieldValue<TField>>> {
    control: Control<FieldValue<TField>>;
    handleImageChange: (file: FileList | null, onChange: (value: File) => void) => void;
    picture: File | null;
    name: TName;
}

function FileInput<TField extends FieldValues, TName extends Path<FieldValue<TField>>>({
    control,
    handleImageChange,
    picture,
    name,
}: IFileInputProps<TField, TName>) {
    return (
        <div className={style.FileInput}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange } }) => (
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id={name}
                        onChange={event => handleImageChange(event.currentTarget.files, onChange)}
                    />
                )}
            />
            <label htmlFor={name}>
                {picture ? (
                    <img src={URL.createObjectURL(picture)} alt={name} />
                ) : (
                    <HiOutlineUserCircle />
                )}
            </label>
        </div>
    );
}

export default FileInput;
