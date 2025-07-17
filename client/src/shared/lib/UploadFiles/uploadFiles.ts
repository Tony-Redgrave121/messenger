import { Dispatch, RefObject, SetStateAction } from 'react';
import getFileObject from '@shared/lib/GetFileObject/getFileObject';
import FileStateSchema from '@shared/types/FileStateSchema';

const uploadFiles = (
    newFiles: FileList,
    setState: Dispatch<SetStateAction<FileStateSchema>>,
    filesRef: RefObject<File[] | null>,
) => {
    setState(prev => {
        const existingFiles = prev.files || [];
        const filesSet = new Set(existingFiles.map(file => file.name));
        const uniqueFiles = Array.from(newFiles).filter(file => !filesSet.has(file.name));

        filesRef.current = [
            ...filesRef.current!,
            ...Array.from(newFiles).filter(file => !filesSet.has(file.name)),
        ];

        return {
            ...prev,
            files: [...existingFiles, ...getFileObject(uniqueFiles)],
        };
    });
};

export default uploadFiles;
