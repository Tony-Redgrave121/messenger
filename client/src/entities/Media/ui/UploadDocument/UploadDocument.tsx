import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';
import { uploadFiles } from '@shared/lib';
import FileStateSchema from '../../model/types/FileStateSchema';

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
                event.target.files && uploadFiles(event.target.files, setState, filesRef);
            }}
            multiple
        />
    );
};

export default UploadDocument;
