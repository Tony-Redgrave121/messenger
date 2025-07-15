import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { FileStateSchema } from '@entities/Media';
import { uploadFiles } from '@shared/lib';

interface IUploadDocumentProps {
    setState: Dispatch<SetStateAction<FileStateSchema>>;
    filesRef: RefObject<File[] | null>;
}

export const UploadDocument: FC<IUploadDocumentProps> = ({ setState, filesRef }) => {
    return (
        <input
            name="addNewFile"
            id="addNewFile"
            type="file"
            style={{ display: 'none' }}
            onChange={event => {
                if (event.target.files) uploadFiles(event.target.files, setState, filesRef);
            }}
            multiple
        />
    );
};

export default UploadDocument;
