import fs from "fs";
import path from "path";
import sharp from "sharp";
import ApiError from "../errors/apiError";
import {Response} from "express";
import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';

class FileService {
    public getFile = async (filepath: string, filename: string, quality: number, res: Response) => {
        const originalPath = path.join(__dirname, '../../static/messengers', filepath, filename);

        if (!fs.existsSync(originalPath)) throw ApiError.notFound('File not found');

        const extension = path.extname(filename).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(extension);
        const isVideo = ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(extension);

        if (isImage) {
            return sharp(originalPath)
                .resize(quality < 100 ? { width: 400 } : undefined)
                .toFormat('jpeg')
                .jpeg({ quality })
                .pipe(res);
        }

        if (isVideo && quality < 100) {
            const passthrough = new stream.PassThrough();
            ffmpeg(originalPath)
                .outputOptions([
                    '-vframes 1',
                    '-q:v 5',
                    '-vf scale=400:-1'
                ])
                .format('mjpeg')
                .on('error', (err) => {
                    console.error('FFmpeg error:', err.message);
                    res.sendStatus(500);
                })
                .pipe(passthrough);

            return passthrough.pipe(res);
        }

        return fs.createReadStream(originalPath).pipe(res);
    }
}

export default FileService