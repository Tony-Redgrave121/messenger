import sharp from 'sharp';

export const resizeImage = async (
    fileBuffer: Buffer,
    width: number = 500,
    height: number = 500,
    format: 'jpeg' | 'png' | 'webp' | 'jpg' = 'jpeg'
): Promise<Buffer> => {
    return await sharp(fileBuffer)
        .resize({
            width,
            height,
            fit: 'cover',
            position: 'center',
        })
        .toFormat(format)
        .toBuffer();
};
