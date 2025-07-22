import { clsx } from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import fetchOgData from '@entities/Message/lib/fetchOgData';
import style from '@entities/Message/ui/attachment.module.css';
import { OpenGraphDataSchema } from '@shared/types';

interface IOgAttachmentProps {
    text?: string;
}

const OgAttachment: FC<IOgAttachmentProps> = ({ text }) => {
    const [ogData, setOgData] = useState<OpenGraphDataSchema | null>(null);

    useEffect(() => {
        if (!text) return;

        const getOGData = async () => {
            const regExp = new RegExp('(http[s]?:\\/\\/)?([^\\/\\s]+\\/)(.*)');
            const matchArray = text.match(regExp);

            if (!matchArray) return;

            const data = await fetchOgData(matchArray[0]);
            setOgData(data);
        };

        getOGData();
    }, [text]);

    return (
        <>
            {ogData && (
                <a className={clsx(style.ReplyBlock, style.OGAttachment)} href={ogData.url}>
                    <p>{ogData.siteName}</p>
                    <p>{ogData.title}</p>
                    <p>{ogData.description}</p>
                    <img src={ogData.image} alt={ogData.title} />
                </a>
            )}
        </>
    );
};

export default OgAttachment;
