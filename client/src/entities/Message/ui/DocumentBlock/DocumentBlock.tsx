import { FC, useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { getFileName } from '@shared/lib';
import { MessageFileSchema } from '@shared/types';
import style from './style.module.css';

interface IDocumentBlockProps {
    doc: MessageFileSchema;
}

const SERVER_URL = process.env.VITE_SERVER_URL;

const DocumentBlock: FC<IDocumentBlockProps> = ({ doc }) => {
    const [blobUrl, setBlobUrl] = useState('');

    const handleClick = async () => {
        if (!blobUrl) {
            const response = await fetch(
                `${SERVER_URL}/static/messengers/${doc.message_file_path}/${doc.message_file_name}`,
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);

                const a = document.createElement('a');
                a.href = url;
                a.download = getFileName(doc.message_file_name);
                a.click();
            }
        }
    };

    return (
        <a onClick={handleClick} className={style.DocumentBlock}>
            <HiOutlineDocumentText />
            <div>
                <h4>{getFileName(doc.message_file_name)}</h4>
                <p>{(doc.message_file_size / 1048576).toFixed(2)} MB &#183;</p>
            </div>
        </a>
    );
};

export default DocumentBlock;
