import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { uploadFiles } from '@shared/lib';
import { FileStateSchema } from '@shared/types';

interface IUploadMediaProps {
    setState: Dispatch<SetStateAction<FileStateSchema>>;
    filesRef: RefObject<File[] | null>;
}

export const UploadMedia: FC<IUploadMediaProps> = ({ setState, filesRef }) => {
    return (
        <input
            name="addNewFile"
            id="addNewFile"
            type="file"
            accept="image/*, video/*"
            style={{ display: 'none' }}
            onChange={event => {
                if (event.target.files) uploadFiles(event.target.files, setState, filesRef);
            }}
            multiple
        />
    );
};

export default UploadMedia;
